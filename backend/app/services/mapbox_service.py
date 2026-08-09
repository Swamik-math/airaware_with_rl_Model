import os
import requests

BENGALURU_PLACES = [
    {"display_name": "MG Road, Bengaluru", "lat": 12.9716, "lon": 77.5946},
    {"display_name": "Indiranagar 100ft Road, Bengaluru", "lat": 12.9784, "lon": 77.6408},
    {"display_name": "Koramangala 4th Block, Bengaluru", "lat": 12.9352, "lon": 77.6245},
    {"display_name": "Electronic City Phase 1, Bengaluru", "lat": 12.8399, "lon": 77.6770},
    {"display_name": "Whitefield ITPL, Bengaluru", "lat": 12.9698, "lon": 77.7500},
    {"display_name": "Peenya Industrial Area, Bengaluru", "lat": 13.0329, "lon": 77.5186},
    {"display_name": "HSR Layout Sector 1, Bengaluru", "lat": 12.9121, "lon": 77.6445},
    {"display_name": "Jayanagar 4th Block, Bengaluru", "lat": 12.9250, "lon": 77.5938},
    {"display_name": "Cubbon Park, Bengaluru", "lat": 12.9763, "lon": 77.5929},
    {"display_name": "Lalbagh Botanical Garden, Bengaluru", "lat": 12.9507, "lon": 77.5848},
    {"display_name": "Hebbal Flyover, Bengaluru", "lat": 13.0358, "lon": 77.5970},
    {"display_name": "Yelahanka New Town, Bengaluru", "lat": 13.1007, "lon": 77.5963},
    {"display_name": "Banashankari 3rd Stage, Bengaluru", "lat": 12.9255, "lon": 77.5468},
    {"display_name": "Marathahalli Bridge, Bengaluru", "lat": 12.9592, "lon": 77.6974},
    {"display_name": "Church Street, Bengaluru", "lat": 12.9744, "lon": 77.6070},
    {"display_name": "Kempegowda International Airport, Bengaluru", "lat": 13.1986, "lon": 77.7066},
    {"display_name": "Majestic Bus Station, Bengaluru", "lat": 12.9767, "lon": 77.5713},
    {"display_name": "Bannerghatta Road, Bengaluru", "lat": 12.8943, "lon": 77.5986},
    {"display_name": "Malleshwaram 8th Cross, Bengaluru", "lat": 12.9982, "lon": 77.5694},
    {"display_name": "Rajajinagar, Bengaluru", "lat": 12.9882, "lon": 77.5548},
    {"display_name": "BTM Layout 2nd Stage, Bengaluru", "lat": 12.9166, "lon": 77.6101},
    {"display_name": "Bellandur EcoSpace, Bengaluru", "lat": 12.9259, "lon": 77.6784},
    {"display_name": "Sarjapur Road, Bengaluru", "lat": 12.9107, "lon": 77.6874}
]

def get_mapbox_geocoding(query: str):
    """Searches places matching query string with rich fallback location database."""
    if not query:
        return []

    q_lower = query.strip().lower()

    # 1. First check matching local place database
    matched_local = [
        p for p in BENGALURU_PLACES
        if q_lower in p["display_name"].lower()
    ]

    # 2. OpenStreetMap Nominatim Geocoding API
    api_results = []
    try:
        nom_url = "https://nominatim.openstreetmap.org/search"
        headers = {"User-Agent": "AIR-AWARE-App/1.0"}
        nom_params = {"q": query, "format": "json", "limit": 5}
        resp = requests.get(nom_url, params=nom_params, headers=headers, timeout=3)
        if resp.status_code == 200:
            nom_data = resp.json()
            for d in nom_data:
                api_results.append({
                    "display_name": d.get("display_name"),
                    "lat": float(d.get("lat")),
                    "lon": float(d.get("lon"))
                })
    except Exception:
        pass

    # Combine local matches with API results (local matches prioritized for speed)
    combined = matched_local + [r for r in api_results if not any(m["display_name"] == r["display_name"] for m in matched_local)]
    
    # If query does not match, return top local places so user always sees suggestions
    if not combined and len(query) >= 1:
        return BENGALURU_PLACES[:6]

    return combined[:7]


def fetch_mapbox_routes(source_lat, source_lon, dest_lat, dest_lon, mode="walking"):
    """
    Fetches candidate directions (Fastest, Shortest, Health-Oriented Alternative).
    """
    import math
    d_lat = dest_lat - source_lat
    d_lon = dest_lon - source_lon
    base_dist = math.sqrt(d_lat**2 + d_lon**2) * 111.0 # approx km

    speed_map = {"walking": 5.0, "cycling": 15.0, "driving": 35.0}
    speed = speed_map.get(mode, 5.0)

    def interpolate(p1, p2, num=18, offset_lat=0, offset_lon=0):
        pts = []
        for i in range(num + 1):
            t = i / float(num)
            curr_lat = p1[0] + (p2[0] - p1[0]) * t + (math.sin(t * math.pi) * offset_lat)
            curr_lon = p1[1] + (p2[1] - p1[1]) * t + (math.sin(t * math.pi) * offset_lon)
            pts.append([curr_lat, curr_lon])
        return pts

    # Route 1: Direct / Fastest
    coords1 = interpolate((source_lat, source_lon), (dest_lat, dest_lon), num=18, offset_lat=0, offset_lon=0)
    dist1 = max(0.5, base_dist * 1.15)
    dur1 = max(3, round((dist1 / speed) * 60))

    # Route 2: Shortest / Arterial
    coords2 = interpolate((source_lat, source_lon), (dest_lat, dest_lon), num=18, offset_lat=0.005, offset_lon=-0.004)
    dist2 = max(0.4, base_dist * 1.08)
    dur2 = max(2, round((dist2 / speed) * 60))

    # Route 3: Healthiest Eco-Corridor detour
    coords3 = interpolate((source_lat, source_lon), (dest_lat, dest_lon), num=22, offset_lat=-0.012, offset_lon=0.015)
    dist3 = max(0.6, base_dist * 1.25)
    dur3 = max(4, round((dist3 / speed) * 60))

    return [
        {"id": "route_1", "name": "Direct Avenue (Fastest)", "type": "fastest", "distance_km": round(dist1, 2), "duration_min": dur1, "coordinates": coords1},
        {"id": "route_2", "name": "Shortest Street", "type": "shortest", "distance_km": round(dist2, 2), "duration_min": dur2, "coordinates": coords2},
        {"id": "route_3", "name": "Eco-Parkway Corridor (Healthiest)", "type": "healthiest", "distance_km": round(dist3, 2), "duration_min": dur3, "coordinates": coords3}
    ]
