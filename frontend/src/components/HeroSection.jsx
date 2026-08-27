import React from "react";
import { ArrowDown, Cpu, Activity, ShieldCheck, MapPin, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="matter-hero-section">
      {/* Background Watermark SVG */}
      <div className="matter-hero-watermark">
        <svg viewBox="0 0 1200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <text
            x="50%"
            y="75%"
            textAnchor="middle"
            className="matter-watermark-text"
          >
            AIRAWARE
          </text>
        </svg>
      </div>

      <div className="matter-hero-container">
        {/* Top Grid: Title & Subtitle */}
        <div className="matter-hero-grid">
          <div className="matter-hero-title-col">
            <h1 className="matter-hero-heading">

              Intelligent Low AQI Route Optimization
            </h1>
          </div>
          <div className="matter-hero-subtitle-col">
            <p className="matter-hero-description">
              Built with adaptive multi-objective pathfinding, AirAware evaluates real-time AQI levels, road networks, and crowd density to compute your cleanest, safest, and fastest travel routes.
            </p>
            <div className="matter-hero-actions">
              <a href="#planner" className="matter-btn-primary">
                Explore Route Planner
              </a>
              <a href="#features" className="matter-btn-secondary">
                View Features
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Stats Cards & Scroll Badge */}
        <div className="matter-hero-bottom-bar">
          <div className="matter-specs-grid">
            <div className="matter-spec-card">
              <div className="matter-spec-info">
                <h3 className="matter-spec-title">Data Ingestion</h3>
                <p className="matter-spec-sub">Live AQICN & OSM Overpass</p>
              </div>
              <div className="matter-spec-val">
                <Activity className="size-5 text-amber-400" />
                <span>Real-Time</span>
              </div>
            </div>

            <div className="matter-spec-card">
              <div className="matter-spec-info">
                <h3 className="matter-spec-title">Core Engine</h3>
                <p className="matter-spec-sub">Dijkstra & A* Heuristics</p>
              </div>
              <div className="matter-spec-val">
                <Cpu className="size-5 text-yellow-400" />
                <span>Multi-Weight</span>
              </div>
            </div>

            <div className="matter-spec-card max-sm:hidden">
              <div className="matter-spec-info">
                <h3 className="matter-spec-title">Health Protection</h3>
                <p className="matter-spec-sub">Pollution & Crowd Mitigation</p>
              </div>
              <div className="matter-spec-val">
                <ShieldCheck className="size-5 text-yellow-300" />
                <span>Up to 92% Reduction</span>
              </div>
            </div>
          </div>

          {/* Rotating Circular Scroll Indicator */}
          <a href="#planner" className="matter-scroll-badge-wrapper" aria-label="Scroll to planner">
            <div className="matter-scroll-badge-circle">
              <div className="matter-scroll-badge-inner">
                <ArrowDown className="size-6 text-amber-400 animate-bounce" />
              </div>
              {/* Circular SVG Text */}
              <svg viewBox="0 0 100 100" className="matter-scroll-badge-text">
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="matter-circular-text-el">
                  <textPath href="#circlePath" startOffset="0%">
                    SCROLL DOWN ✦ AIRAWARE NAV ✦
                  </textPath>
                </text>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
