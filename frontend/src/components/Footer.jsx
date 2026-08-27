import React from "react";
import { Navigation, ArrowUpRight, Heart, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="matter-footer-wrapper">
      {/* Intersecting CTA Banner */}
      <div className="matter-cta-banner-container">
        <div className="matter-cta-banner">
          <div className="matter-cta-glow"></div>
          <div className="matter-cta-content">
            <h2 className="matter-cta-heading">
              Breathe Cleaner Air On Every Commute
            </h2>
            <p className="matter-cta-sub">
              Experience intelligent low-AQI route optimization tailored for your health and travel speed.
            </p>
            <div className="matter-cta-actions">
              <a href="#planner" className="matter-cta-pill-btn-large">
                <span>Start Planning Now</span>
                <ArrowUpRight className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="matter-footer-content">
        <div className="matter-footer-grid">
          {/* Brand Info */}
          <div className="matter-footer-brand-col">
            <a href="#home" className="matter-brand-link mb-4">
              <div className="matter-brand-icon">
                <Navigation className="size-5 text-amber-400" />
              </div>
              <span className="matter-brand-text">AirAware</span>
            </a>
            <p className="matter-footer-desc">
              Next-generation health-focused route optimization platform balancing physical travel efficiency with real-time pollution and crowd exposure metrics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="matter-footer-nav-col">
            <h4 className="matter-footer-col-title">Navigation</h4>
            <ul className="matter-footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#planner">Route Planner</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#architecture">Architecture</a></li>
              <li><a href="#faqs">FAQs</a></li>
            </ul>
          </div>

          {/* Core Tech */}
          <div className="matter-footer-nav-col">
            <h4 className="matter-footer-col-title">Technologies</h4>
            <ul className="matter-footer-links">
              <li><a href="https://react.dev/" target="_blank" rel="noreferrer">React + Vite</a></li>
              <li><a href="https://leafletjs.com/" target="_blank" rel="noreferrer">Leaflet Maps</a></li>
              <li><a href="https://flask.palletsprojects.com/" target="_blank" rel="noreferrer">Flask API</a></li>
              <li><a href="https://aqicn.org/" target="_blank" rel="noreferrer">AQICN API</a></li>
              <li><a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer">OpenStreetMap</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="matter-footer-nav-col">
            <h4 className="matter-footer-col-title">Open Source</h4>
            <ul className="matter-footer-links">
              <li>
                <a
                  href="https://github.com/Swamik-math/air-aware"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <svg className="size-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="matter-footer-bottom">
          <p>© {new Date().getFullYear()} AirAware. Low AQI Route Optimization System.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="size-3.5 text-rose-500 fill-rose-500" /> for healthier urban commutes.
          </p>
        </div>
      </div>
    </footer>
  );
}
