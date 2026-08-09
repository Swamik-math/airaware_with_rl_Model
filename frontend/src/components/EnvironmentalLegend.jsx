import React from "react";

export default function EnvironmentalLegend() {
  return (
    <div className="clean-map-legend">
      <div className="legend-header">
        <span className="legend-title">AIR QUALITY</span>
      </div>
      <div className="legend-gradient" />
      <div className="legend-ticks">
        <span className="tick-good">0 Clean</span>
        <span className="tick-mod">50 Mod</span>
        <span className="tick-poor">100 Poor</span>
        <span className="tick-unhealthy">150+ Unhealthy</span>
      </div>
    </div>
  );
}
