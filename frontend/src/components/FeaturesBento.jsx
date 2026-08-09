import React from "react";
import { Wind, Map, Sliders, Shield, Compass, BarChart3, Sparkles } from "lucide-react";

export default function FeaturesBento() {
  const features = [
    {
      id: "aqi",
      size: "large",
      icon: Wind,
      badge: "Real-Time Sensors",
      title: "Live AQI & Pollution Mapping",
      description: "Extracts real-time atmospheric PM2.5 and PM10 metrics from AQICN station feeds, mapping environmental toxicity onto individual road segments.",
      stat: "1,200+ Stations",
      accent: "from-cyan-500/20 to-blue-500/10",
      iconColor: "text-cyan-400"
    },
    {
      id: "osm",
      size: "medium",
      icon: Map,
      badge: "Spatial Network",
      title: "Overpass OSM Graph",
      description: "Generates high-fidelity road network edges from OpenStreetMap, computing precise node distances and intersection traversal penalties.",
      stat: "OSM Network",
      accent: "from-emerald-500/20 to-teal-500/10",
      iconColor: "text-emerald-400"
    },
    {
      id: "cost",
      size: "medium",
      icon: Sliders,
      badge: "User Preference",
      title: "Dynamic Weight Tuning",
      description: "Tailor pathfinding cost calculations using interactive sliders balancing Distance (w1), AQI Exposure (w2), and Crowd Density (w3).",
      stat: "3 Custom Weights",
      accent: "from-purple-500/20 to-indigo-500/10",
      iconColor: "text-purple-400"
    },
    {
      id: "pathfinding",
      size: "large",
      icon: Compass,
      badge: "Core Algorithms",
      title: "Dijkstra & A* Dual Search",
      description: "Runs parallel pathfinding algorithms to output 3 distinct routes: Shortest distance, Fastest travel time, and Healthiest minimal-pollution exposure.",
      stat: "3 Route Models",
      accent: "from-amber-500/20 to-orange-500/10",
      iconColor: "text-amber-400"
    },
    {
      id: "health",
      size: "small",
      icon: Shield,
      badge: "Protection",
      title: "Exposure Shield",
      description: "Reduces inhaled particulate matter exposure by up to 92% compared to standard shortest paths.",
      stat: "-92% PM2.5",
      accent: "from-teal-500/20 to-cyan-500/10",
      iconColor: "text-teal-400"
    },
    {
      id: "analytics",
      size: "small",
      icon: BarChart3,
      badge: "Insights",
      title: "Route Insights",
      description: "Detailed analytics cards comparing total distance, travel duration, AQI score, and health index.",
      stat: "Real-time Metrics",
      accent: "from-blue-500/20 to-cyan-500/10",
      iconColor: "text-blue-400"
    }
  ];

  return (
    <section id="features" className="matter-features-section">
      <div className="matter-section-header">
        <div className="matter-badge-pill">
          <Sparkles className="size-3.5 text-cyan-400" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="matter-section-title">
          Engineered for Clean & Efficient Navigation
        </h2>
        <p className="matter-section-subtitle">
          Discover how AirAware combines spatial road graphs, real-time pollution metrics, and weighted heuristic search to deliver healthiest route options.
        </p>
      </div>

      <div className="matter-bento-grid">
        {features.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className={`matter-bento-card matter-bento-${item.size} bg-gradient-to-br ${item.accent}`}
            >
              <div className="matter-bento-top">
                <div className="matter-bento-icon-wrapper">
                  <IconComponent className={`size-6 ${item.iconColor}`} />
                </div>
                <span className="matter-bento-badge">{item.badge}</span>
              </div>
              <div className="matter-bento-body">
                <h3 className="matter-bento-title">{item.title}</h3>
                <p className="matter-bento-desc">{item.description}</p>
              </div>
              <div className="matter-bento-footer">
                <span className="matter-bento-stat">{item.stat}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
