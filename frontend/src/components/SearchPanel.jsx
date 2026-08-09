import React, { useState } from "react";
import { Navigation, MapPin, ArrowRight, Sliders, ArrowUpDown, Sparkles } from "lucide-react";

export default function SearchPanel({
  sourceText,
  setSourceText,
  destinationText,
  setDestinationText,
  sourceSuggestions,
  destinationSuggestions,
  onSelectSuggestion,
  onSubmit,
  loading,
  pinMode,
  setPinMode,
  preference,
  setPreference,
  weights,
  setWeight,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSwap = () => {
    const temp = sourceText;
    setSourceText(destinationText);
    setDestinationText(temp);
  };

  return (
    <div className="clean-search-card">
      <div className="clean-card-header">
        <div className="clean-badge">
          <Sparkles className="size-3.5 text-emerald-500" />
          <span>HEALTH-AWARE NAVIGATION</span>
        </div>
        <h1 className="clean-card-title">Take the healthier route</h1>
        <p className="clean-card-subtitle">
          Find paths through clean air zones & avoid pollution hotspots.
        </p>
      </div>

      <form onSubmit={onSubmit} className="clean-form">
        {/* Connected Google Maps-style Search Input Group */}
        <div className="clean-route-inputs">
          <div className="clean-input-row">
            <span className="clean-dot src-dot">📍</span>
            <input
              className="clean-input-control"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Origin location in Bengaluru..."
            />
            {sourceSuggestions.length > 0 && (
              <div className="clean-suggestions-drop">
                {sourceSuggestions.map((item) => (
                  <button
                    key={`${item.place_id}-src`}
                    type="button"
                    className="clean-suggestion-item"
                    onClick={() => onSelectSuggestion("source", item)}
                  >
                    {item.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="clean-input-connector">
            <div className="connector-line" />
            <button
              type="button"
              className="swap-btn"
              onClick={handleSwap}
              title="Swap origin and destination"
            >
              <ArrowUpDown className="size-3.5 text-slate-400" />
            </button>
          </div>

          <div className="clean-input-row">
            <span className="clean-dot dst-dot">◎</span>
            <input
              className="clean-input-control"
              value={destinationText}
              onChange={(e) => setDestinationText(e.target.value)}
              placeholder="Destination location..."
            />
            {destinationSuggestions.length > 0 && (
              <div className="clean-suggestions-drop">
                {destinationSuggestions.map((item) => (
                  <button
                    key={`${item.place_id}-dst`}
                    type="button"
                    className="clean-suggestion-item"
                    onClick={() => onSelectSuggestion("destination", item)}
                  >
                    {item.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pin Placement Selector */}
        <div className="clean-pin-selector">
          <span className="pin-hint">Pick on map:</span>
          <div className="pin-btns">
            <button
              type="button"
              className={`pin-btn ${pinMode === "source" ? "active-src" : ""}`}
              onClick={() => setPinMode(pinMode === "source" ? null : "source")}
            >
              📍 Set Origin
            </button>
            <button
              type="button"
              className={`pin-btn ${pinMode === "destination" ? "active-dst" : ""}`}
              onClick={() => setPinMode(pinMode === "destination" ? null : "destination")}
            >
              ◎ Set Destination
            </button>
          </div>
        </div>

        {/* Advanced Dynamic Weights Toggle */}
        <div className="clean-advanced-toggle">
          <button
            type="button"
            className="advanced-btn"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Sliders className="size-3.5" />
            <span>{showAdvanced ? "Hide AQI Sliders" : "Tune AQI Weights"}</span>
          </button>
        </div>

        {showAdvanced && (
          <div className="clean-weights-box">
            <div className="weight-item">
              <span>Distance ({weights.distance})</span>
              <input
                type="range"
                min="0.05"
                max="0.9"
                step="0.05"
                value={weights.distance}
                onChange={(e) => setWeight("distance", e.target.value)}
              />
            </div>
            <div className="weight-item">
              <span className="text-emerald-500 font-semibold">AQI Protection ({weights.aqi})</span>
              <input
                type="range"
                min="0.05"
                max="0.9"
                step="0.05"
                value={weights.aqi}
                onChange={(e) => setWeight("aqi", e.target.value)}
              />
            </div>
            <div className="weight-item">
              <span>Density ({weights.density})</span>
              <input
                type="range"
                min="0.05"
                max="0.9"
                step="0.05"
                value={weights.density}
                onChange={(e) => setWeight("density", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Main Action Button */}
        <button type="submit" className="clean-primary-btn" disabled={loading}>
          {loading ? (
            <span>Computing Healthiest Route...</span>
          ) : (
            <>
              <span>FIND HEALTHIEST ROUTE</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
