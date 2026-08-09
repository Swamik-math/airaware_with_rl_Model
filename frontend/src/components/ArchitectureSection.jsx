import React, { useState } from "react";
import { Cpu, Network, Layers, Database, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ArchitectureSection() {
  const [activeTab, setActiveTab] = useState("cost");

  return (
    <section id="architecture" className="matter-arch-section">
      <div className="matter-section-header">
        <div className="matter-badge-pill">
          <Cpu className="size-3.5 text-cyan-400" />
          <span>System Architecture</span>
        </div>
        <h2 className="matter-section-title">
          How AirAware Calculates Your Route
        </h2>
        <p className="matter-section-subtitle">
          Explore the algorithmic breakdown, cost formulas, and data pipelines powering our low-exposure navigation engine.
        </p>
      </div>

      <div className="matter-arch-container">
        {/* Navigation Tabs */}
        <div className="matter-arch-tabs">
          <button
            type="button"
            onClick={() => setActiveTab("cost")}
            className={`matter-arch-tab-btn ${activeTab === "cost" ? "active" : ""}`}
          >
            <Layers className="size-4" />
            <span>Weighted Cost Formula</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("algorithms")}
            className={`matter-arch-tab-btn ${activeTab === "algorithms" ? "active" : ""}`}
          >
            <Network className="size-4" />
            <span>Dijkstra & A* Pathfinding</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pipeline")}
            className={`matter-arch-tab-btn ${activeTab === "pipeline" ? "active" : ""}`}
          >
            <Database className="size-4" />
            <span>Data Pipeline Stack</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="matter-arch-card">
          {activeTab === "cost" && (
            <div className="matter-arch-content-panel">
              <div className="matter-arch-formula-box">
                <span className="matter-formula-label">Cost Function</span>
                <div className="matter-formula-code">
                  <code>Cost = (w₁ × Normalized Distance) + (w₂ × AQI Exposure) + (w₃ × Density)</code>
                </div>
              </div>

              <div className="matter-arch-details-grid">
                <div className="matter-arch-detail-item">
                  <div className="matter-detail-head">
                    <span className="matter-weight-tag">w₁ = Distance</span>
                  </div>
                  <p>Minimizes physical travel mileage between source and destination nodes in the road graph.</p>
                </div>

                <div className="matter-arch-detail-item">
                  <div className="matter-detail-head">
                    <span className="matter-weight-tag">w₂ = Air Quality Index</span>
                  </div>
                  <p>Evaluates atmospheric PM2.5/PM10 concentration along edges, prioritizing clean corridors.</p>
                </div>

                <div className="matter-arch-detail-item">
                  <div className="matter-detail-head">
                    <span className="matter-weight-tag">w₃ = Population Density</span>
                  </div>
                  <p>Incorporate crowd metrics to avoid high-congestion, high-emission commercial zones.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "algorithms" && (
            <div className="matter-arch-content-panel">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="matter-algo-box">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="matter-algo-badge bg-blue-500/20 text-blue-400">Dijkstra's Algorithm</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2">Shortest & Fastest Routes</h4>
                  <p className="text-slate-400 text-sm mb-4">
                    Computes exact baseline shortest paths using edge distance and travel-time proxies (distance / speed limit).
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-cyan-400" /> Guarantees shortest geometric distance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-cyan-400" /> Computes minimal time baseline
                    </li>
                  </ul>
                </div>

                <div className="matter-algo-box">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="matter-algo-badge bg-emerald-500/20 text-emerald-400">A* Search with Heuristics</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2">Healthiest Low-Pollution Route</h4>
                  <p className="text-slate-400 text-sm mb-4">
                    Leverages Euclidean distance heuristics combined with composite environmental costs for ultra-fast heuristic graph traversal.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400" /> Dynamic min-max feature scaling
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400" /> Sub-second heuristic graph search
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pipeline" && (
            <div className="matter-arch-content-panel">
              <div className="matter-pipeline-steps">
                <div className="matter-pipe-step">
                  <div className="matter-pipe-num">1</div>
                  <h4>Data Fetch</h4>
                  <p>Overpass API (OSM) & AQICN API station polling</p>
                </div>
                <ArrowRight className="matter-pipe-arrow max-md:hidden" />
                <div className="matter-pipe-step">
                  <div className="matter-pipe-num">2</div>
                  <h4>Normalization</h4>
                  <p>Min-Max scaling of distance, AQI, and density metrics</p>
                </div>
                <ArrowRight className="matter-pipe-arrow max-md:hidden" />
                <div className="matter-pipe-step">
                  <div className="matter-pipe-num">3</div>
                  <h4>Path Finding</h4>
                  <p>Flask backend pathfinding engine execution</p>
                </div>
                <ArrowRight className="matter-pipe-arrow max-md:hidden" />
                <div className="matter-pipe-step">
                  <div className="matter-pipe-num">4</div>
                  <h4>UI Overlay</h4>
                  <p>React Leaflet interactive multi-route polylines</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
