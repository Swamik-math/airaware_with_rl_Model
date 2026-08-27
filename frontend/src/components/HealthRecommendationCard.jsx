import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function HealthRecommendationCard({
  routes,
  selectedRoute,
  onSelectRoute,
  onHoverRoute
}) {
  if (!routes) return null;

  const healthiest = routes.healthiest;
  const fastest = routes.fastest;
  const shortest = routes.shortest;

  if (!healthiest) return null;

  const healthScore = healthiest.health_score || 92;
  const strokeDashoffset = 283 - (283 * healthScore) / 100;

  const healthiestExposure = healthiest.avg_aqi || 42;
  const fastestExposure = fastest?.avg_aqi || 95;
  const reductionPercent = Math.max(
    15,
    Math.round(((fastestExposure - healthiestExposure) / Math.max(fastestExposure, 1)) * 100)
  );

  return (
    <div className="clean-health-card">
      <div className="health-card-badge-row">
        <div className="rec-badge">
          <Sparkles className="size-3.5 text-yellow-500" />
          <span>✓ RECOMMENDED HEALTHIEST PATH</span>
        </div>
      </div>

      <div className="health-card-top">
        {/* Circular Health Score Ring */}
        <div className="score-ring-box">
          <svg className="ring-svg" viewBox="0 0 100 100">
            <circle className="ring-bg" cx="50" cy="50" r="45" />
            <circle
              className="ring-progress"
              cx="50"
              cy="50"
              r="45"
              style={{ strokeDashoffset }}
            />
          </svg>
          <div className="ring-content">
            <span className="ring-score-val">{healthScore}</span>
            <span className="ring-score-max">/100</span>
          </div>
        </div>

        {/* Healthiest Metrics */}
        <div className="health-metrics-box">
          <h3 className="health-title">Healthiest Route Summary</h3>
          <p className="health-specs">
            <strong>{healthiest.distance_km} km</strong> · <span>{healthiest.duration_min} min</span> · <strong className="text-yellow-500 font-bold">AQI {healthiest.avg_aqi}</strong>
          </p>
          <ul className="benefit-bullets">
            <li>
              <CheckCircle2 className="size-3.5 text-yellow-500 shrink-0" />
              <span>Avoids high-pollution zones</span>
            </li>
            <li>
              <CheckCircle2 className="size-3.5 text-yellow-500 shrink-0" />
              <strong className="text-emerald-600 dark:text-yellow-400">{reductionPercent}% lower pollution exposure</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Pollution Exposure Bar Chart Comparison */}
      <div className="clean-exposure-box">
        <h4 className="exp-box-title">Pollution Exposure Comparison</h4>
        <div className="exp-bars-container">
          <div className="exp-bar-row">
            <span className="bar-label">Fastest Path</span>
            <div className="bar-track">
              <div className="bar-fill bg-orange-500" style={{ width: "78%" }} />
            </div>
            <span className="bar-val">78%</span>
          </div>
          <div className="exp-bar-row">
            <span className="bar-label font-bold text-yellow-500">Healthiest</span>
            <div className="bar-track">
              <div className="bar-fill bg-yellow-500" style={{ width: "22%" }} />
            </div>
            <span className="bar-val font-bold text-yellow-500">22%</span>
          </div>
        </div>
      </div>

      {/* Route Options Switcher */}
      <div className="clean-route-options">
        <span className="options-title">Route Options:</span>
        <div className="options-grid">
          <button
            type="button"
            className={`option-card ${selectedRoute === "healthiest" ? "active-health" : ""}`}
            onClick={() => onSelectRoute("healthiest")}
            onMouseEnter={() => onHoverRoute?.("healthiest")}
            onMouseLeave={() => onHoverRoute?.("")}
          >
            <div className="option-head">
              <span className="option-name text-yellow-500">🟢 Healthiest</span>
              <span className="option-tag">Recommended</span>
            </div>
            <p className="option-stats">{healthiest.distance_km} km · {healthiest.duration_min}m · AQI {healthiest.avg_aqi}</p>
          </button>

          {fastest && (
            <button
              type="button"
              className={`option-card ${selectedRoute === "fastest" ? "active-fast" : ""}`}
              onClick={() => onSelectRoute("fastest")}
              onMouseEnter={() => onHoverRoute?.("fastest")}
              onMouseLeave={() => onHoverRoute?.("")}
            >
              <div className="option-head">
                <span className="option-name text-amber-500">🟡 Fastest</span>
              </div>
              <p className="option-stats">{fastest.distance_km} km · {fastest.duration_min}m · AQI {fastest.avg_aqi}</p>
            </button>
          )}

          {shortest && (
            <button
              type="button"
              className={`option-card ${selectedRoute === "shortest" ? "active-short" : ""}`}
              onClick={() => onSelectRoute("shortest")}
              onMouseEnter={() => onHoverRoute?.("shortest")}
              onMouseLeave={() => onHoverRoute?.("")}
            >
              <div className="option-head">
                <span className="option-name text-blue-500">🔵 Shortest</span>
              </div>
              <p className="option-stats">{shortest.distance_km} km · {shortest.duration_min}m · AQI {shortest.avg_aqi}</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
