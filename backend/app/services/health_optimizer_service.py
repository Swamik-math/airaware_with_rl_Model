import math
from app.services.aqi_service import get_aqi_for_point

# Configuration weights per route priority
DEFAULT_WEIGHTS = {
    "health first": {"env": 0.60, "time": 0.20, "dist": 0.10, "traffic": 0.10},
    "balanced": {"env": 0.40, "time": 0.30, "dist": 0.20, "traffic": 0.10},
    "time first": {"env": 0.20, "time": 0.50, "dist": 0.20, "traffic": 0.10}
}

def analyze_and_rank_routes(candidate_routes, health_profile=None, custom_weights=None):
    """
    Analyzes multiple candidate routes against environmental data and user health profile.
    Returns ranked routes with health score (0-100), exposure estimates, and explainability reasons.
    """
    if not candidate_routes:
        return []

    profile = health_profile or {}
    sensitivity = (profile.get("air_sensitivity") or "Moderate").lower()
    priority = (profile.get("route_priority") or "Health First").lower()
    conditions = profile.get("conditions") or []
    pollutants = profile.get("priority_pollutants") or ["PM2.5"]

    # Select base weights
    weights = DEFAULT_WEIGHTS.get(priority, DEFAULT_WEIGHTS["health first"])
    if custom_weights:
        weights = custom_weights

    # Sensitivity penalty factor for higher AQI segments
    sens_multiplier = 1.3 if sensitivity == "high" else (1.15 if sensitivity == "moderate" else 1.0)
    if any(c.lower() in ["asthma", "copd", "cardiovascular sensitivity"] for c in conditions):
        sens_multiplier += 0.15

    analyzed_routes = []
    
    for route in candidate_routes:
        coords = route.get("coordinates", [])
        duration_min = route.get("duration_min", 30)
        distance_km = route.get("distance_km", 5.0)
        traffic_delay = route.get("traffic_delay_min", 0)

        # Sample segments along the route (up to 10 points)
        segment_count = min(10, max(3, len(coords)))
        step = max(1, len(coords) // segment_count)
        sampled_coords = coords[::step][:segment_count] if coords else []

        aqi_sum = 0
        pm25_sum = 0
        pm10_sum = 0
        no2_sum = 0
        high_polluted_segments = 0
        segment_breakdown = []

        for idx, pt in enumerate(sampled_coords):
            lat, lon = pt[0], pt[1]
            aqi_info = get_aqi_for_point(lat, lon)
            aqi_val = aqi_info.get("aqi", 50)
            pm25 = aqi_info.get("pm25", round(aqi_val * 0.4, 1))
            pm10 = aqi_info.get("pm10", round(aqi_val * 0.6, 1))
            no2 = aqi_info.get("no2", round(aqi_val * 0.2, 1))

            aqi_sum += aqi_val
            pm25_sum += pm25
            pm10_sum += pm10
            no2_sum += no2

            status = "Good" if aqi_val <= 50 else ("Moderate" if aqi_val <= 100 else ("Poor" if aqi_val <= 150 else "Unhealthy"))
            if aqi_val > 80:
                high_polluted_segments += 1

            segment_breakdown.append({
                "segment_index": idx + 1,
                "lat": lat,
                "lon": lon,
                "aqi": aqi_val,
                "pm25": pm25,
                "pm10": pm10,
                "no2": no2,
                "status": status
            })

        avg_aqi = round(aqi_sum / max(1, len(sampled_coords)))
        avg_pm25 = round(pm25_sum / max(1, len(sampled_coords)), 1)
        avg_pm10 = round(pm10_sum / max(1, len(sampled_coords)), 1)

        # Environmental penalty score normalized (0 - 100)
        env_score_raw = avg_aqi * sens_multiplier
        if "PM2.5" in pollutants:
            env_score_raw += (avg_pm25 * 0.3)

        # Health score calculation (Higher is cleaner/healthier)
        # Max AQI = 200 corresponds to lower health score
        health_score = max(15, min(99, round(100 - (env_score_raw * 0.38))))

        # Composite optimization cost (Lower cost is better)
        normalized_env = min(1.0, env_score_raw / 200.0)
        normalized_time = min(1.0, duration_min / 90.0)
        normalized_dist = min(1.0, distance_km / 30.0)
        normalized_traffic = min(1.0, traffic_delay / 30.0)

        composite_cost = (
            weights.get("env", 0.5) * normalized_env +
            weights.get("time", 0.3) * normalized_time +
            weights.get("dist", 0.1) * normalized_dist +
            weights.get("traffic", 0.1) * normalized_traffic
        )

        analyzed_routes.append({
            "id": route.get("id"),
            "name": route.get("name", "Route"),
            "type": route.get("type", "candidate"),
            "distance_km": round(distance_km, 2),
            "duration_min": round(duration_min),
            "avg_aqi": avg_aqi,
            "avg_pm25": avg_pm25,
            "avg_pm10": avg_pm10,
            "health_score": health_score,
            "high_polluted_segments": high_polluted_segments,
            "composite_cost": composite_cost,
            "coordinates": coords,
            "segments": segment_breakdown,
            "exposure_level": "Low" if avg_aqi <= 50 else ("Moderate" if avg_aqi <= 90 else "High")
        })

    # Sort routes by composite cost (best route first)
    analyzed_routes.sort(key=lambda r: r["composite_cost"])

    # Designate recommended route
    recommended = analyzed_routes[0]
    recommended["is_recommended"] = True

    # Generate Explainability ("Why this route?")
    fastest_route = min(analyzed_routes, key=lambda r: r["duration_min"])
    shortest_route = min(analyzed_routes, key=lambda r: r["distance_km"])
    cleanest_route = max(analyzed_routes, key=lambda r: r["health_score"])

    explanation_reasons = []
    if recommended["id"] == cleanest_route["id"]:
        explanation_reasons.append("✓ Lowest estimated AQI exposure along the route")
    else:
        aqi_diff = fastest_route["avg_aqi"] - recommended["avg_aqi"]
        if aqi_diff > 0:
            explanation_reasons.append(f"✓ Reduces estimated AQI exposure by ~{aqi_diff} points vs fastest option")

    if recommended["high_polluted_segments"] == 0:
        explanation_reasons.append("✓ Completely avoids high-pollution segments")
    elif recommended["high_polluted_segments"] < fastest_route["high_polluted_segments"]:
        diff = fastest_route["high_polluted_segments"] - recommended["high_polluted_segments"]
        explanation_reasons.append(f"✓ Avoids {diff} high-pollution road segment{'s' if diff > 1 else ''}")

    explanation_reasons.append(f"✓ Customized for your '{priority.title()}' routing preference")
    
    if sensitivity == "high":
        explanation_reasons.append("✓ Adjusted for High Air-Quality Sensitivity")

    time_diff = recommended["duration_min"] - fastest_route["duration_min"]
    if time_diff <= 2:
        explanation_reasons.append("✓ Negligible extra travel time (+0-2 min)")
    else:
        explanation_reasons.append(f"✓ Only {round(time_diff)} minutes longer than the fastest route")

    recommended["explanation"] = {
        "title": "Why we recommend this route",
        "summary": f"Recommended because it minimizes estimated environmental exposure while keeping travel duration reasonable for your profile.",
        "reasons": explanation_reasons
    }

    return {
        "recommended_id": recommended["id"],
        "recommended_route": recommended,
        "fastest_id": fastest_route["id"],
        "shortest_id": shortest_route["id"],
        "cleanest_id": cleanest_route["id"],
        "routes": analyzed_routes,
        "disclaimer": "This environmental route score provides general guidance based on available AQI data and your preferences. It is not a medical diagnosis or treatment advice."
    }
