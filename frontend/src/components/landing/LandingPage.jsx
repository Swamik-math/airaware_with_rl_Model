import { useState, useEffect } from "react";
import { ArrowRight, Wind, ShieldAlert, Activity, CheckCircle2, Navigation, Layers } from "lucide-react";
import MapboxView from "../map/MapboxView";
import { calculateHealthRoutes, getAqiGrid } from "../../api/client";

export default function LandingPage({ onGetStarted, onExploreDemo }) {
  const [heroRoutes, setHeroRoutes] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("healthiest");

  useEffect(() => {
    async function loadLandingData() {
      try {
        const gridData = await getAqiGrid();
        setSectors(gridData);
      } catch (e) {}

      try {
        const routeData = await calculateHealthRoutes(
          { lat: 12.9716, lon: 77.5946 }, // MG Road
          { lat: 12.8399, lon: 77.6770 }, // Electronic City
          "walking"
        );
        setHeroRoutes(routeData);
      } catch (e) {}
    }
    loadLandingData();
  }, []);

  return (
    <div className="w-full space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="pt-10 lg:pt-16 px-4 lg:px-12 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-extrabold tracking-widest text-[#B7D96B] uppercase">
            AIR-AWARE NAVIGATION
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#F1F5EE] leading-tight">
            Your route. Your air. <br className="hidden sm:inline" />
            <span className="text-[#B7D96B]">Your health.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#9AAEA5] max-w-2xl mx-auto font-normal leading-relaxed">
            Find routes that consider more than distance. AIR-AWARE optimizes travel around real-time air quality, PM2.5 particulates, and individual health sensitivities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="btn-primary text-sm px-6 py-3"
            >
              <span>Find a healthier route</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreDemo}
              className="btn-secondary text-sm px-6 py-3"
            >
              <span>Explore the map</span>
            </button>
          </div>
        </div>

        {/* HERO MAP VISUALIZATION CENTERPIECE */}
        <div className="relative mt-8 vayu-panel p-2.5 rounded-2xl border-[#23443B]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0D2521] rounded-xl border border-[#23443B] mb-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B7D96B] animate-pulse" />
              <span className="font-bold text-[#F1F5EE]">Live Navigation Engine</span>
              <span className="text-[#9AAEA5] hidden sm:inline">• MG Road to Electronic City Corridor</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-[#9AAEA5]">
              <span className="text-[#B7D96B] font-bold">● Healthiest Route (AQI 42)</span>
              <span className="hidden md:inline">● Fastest (AQI 68)</span>
            </div>
          </div>

          <div className="h-[460px] rounded-xl overflow-hidden relative">
            <MapboxView
              source={[12.9716, 77.5946]}
              destination={[12.8399, 77.6770]}
              routes={heroRoutes}
              sectors={sectors}
              selectedRoute={selectedRouteId}
              onSelectRoute={setSelectedRouteId}
            />
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL / PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-12">
        <div className="vayu-panel p-8 lg:p-12 bg-[#0D2521] border-[#23443B]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#E7C873] uppercase tracking-wider">
                The Shortest Route Problem
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F1F5EE] leading-tight">
                THE SHORTEST ROUTE ISN'T ALWAYS THE HEALTHIEST.
              </h2>
              <p className="text-[#9AAEA5] text-sm leading-relaxed">
                Standard GPS platforms select routes strictly based on distance and vehicular speed. Two parallel streets with identical travel times can expose pedestrians and cyclists to wildly different levels of toxic exhaust, micro-particulates, and urban congestion.
              </p>

              <div className="space-y-2 pt-2 text-xs text-[#F1F5EE]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B7D96B] flex-shrink-0 mt-0.5" />
                  <span>Continuous street-level particulate sampling avoiding toxic traffic hotspots.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B7D96B] flex-shrink-0 mt-0.5" />
                  <span>Calculates composite environmental cost factoring AQI, PM2.5, and exposure time.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="vayu-card p-4 border-[#D96B63]/40 bg-[#D96B63]/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#D96B63] uppercase">Standard Direct Route</span>
                  <span className="text-xs font-bold text-[#D96B63]">AQI 106</span>
                </div>
                <p className="text-sm font-bold text-[#F1F5EE] mt-1">7.2 km • 34 min</p>
                <p className="text-xs text-[#9AAEA5]">Heavy traffic exhaust, high NO₂ exposure</p>
              </div>

              <div className="vayu-card p-4 border-[#B7D96B] bg-[#102C27]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#B7D96B] uppercase">AIR-AWARE Recommended</span>
                    <span className="text-[9px] bg-[#B7D96B]/20 text-[#B7D96B] px-2 py-0.5 rounded font-bold">RECOMMENDED</span>
                  </div>
                  <span className="text-xs font-bold text-[#78C091]">AQI 42</span>
                </div>
                <p className="text-sm font-bold text-[#F1F5EE] mt-1">7.8 km • 38 min</p>
                <p className="text-xs text-[#9AAEA5]">Clean parkway corridor • Health Score 94/100</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ENVIRONMENTAL METRICS DATA STRIP */}
      <section className="max-w-7xl mx-auto px-4 lg:px-12">
        <div className="vayu-panel p-6 bg-[#0D2521] border-[#23443B]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#23443B]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#9AAEA5] uppercase tracking-wider">Air Quality Index</span>
              <p className="text-2xl font-extrabold font-heading text-[#78C091]">AQI 42</p>
              <p className="text-[11px] text-[#9AAEA5]">Good Air Quality</p>
            </div>
            <div className="space-y-1 pt-4 md:pt-0">
              <span className="text-[11px] font-bold text-[#9AAEA5] uppercase tracking-wider">PM2.5 Exposure</span>
              <p className="text-2xl font-extrabold font-heading text-[#6FBF9A]">16.8 µg/m³</p>
              <p className="text-[11px] text-[#9AAEA5]">Low Inhalation Rate</p>
            </div>
            <div className="space-y-1 pt-4 md:pt-0">
              <span className="text-[11px] font-bold text-[#9AAEA5] uppercase tracking-wider">Traffic Idle</span>
              <p className="text-2xl font-extrabold font-heading text-[#E7C873]">2.4 min</p>
              <p className="text-[11px] text-[#9AAEA5]">Minimal Exhaust Stagnation</p>
            </div>
            <div className="space-y-1 pt-4 md:pt-0">
              <span className="text-[11px] font-bold text-[#9AAEA5] uppercase tracking-wider">Health Score</span>
              <p className="text-2xl font-extrabold font-heading text-[#B7D96B]">94 / 100</p>
              <p className="text-[11px] text-[#9AAEA5]">Optimized Corridor</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROUTE COMPARISON SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-12 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F1F5EE]">
            Route Optimization Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-[#9AAEA5]">
            AIR-AWARE evaluates candidate route options side-by-side so you can make informed travel decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="vayu-card p-5 border-[#B7D96B] space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B7D96B] uppercase">HEALTHIEST ROUTE</span>
              <span className="text-xs font-extrabold text-[#071A17] bg-[#B7D96B] px-2 py-0.5 rounded">RECOMMENDED</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-heading text-[#78C091]">AQI 42</p>
              <p className="text-xs text-[#9AAEA5]">Good • Low Pollution</p>
            </div>
            <div className="space-y-1.5 text-xs text-[#F1F5EE] border-t border-[#23443B] pt-3">
              <div className="flex justify-between"><span>Distance</span><strong className="font-semibold">12.4 km</strong></div>
              <div className="flex justify-between"><span>Travel Time</span><strong className="font-semibold">31 min</strong></div>
              <div className="flex justify-between"><span>Health Score</span><strong className="text-[#B7D96B] font-bold">94 / 100</strong></div>
            </div>
          </div>

          <div className="vayu-card p-5 border-[#23443B] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#9AAEA5] uppercase">FASTEST ROUTE</span>
              <span className="text-xs font-semibold text-[#9AAEA5]">Alternative</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-heading text-[#E3C85A]">AQI 68</p>
              <p className="text-xs text-[#9AAEA5]">Moderate • Traffic Corridors</p>
            </div>
            <div className="space-y-1.5 text-xs text-[#F1F5EE] border-t border-[#23443B] pt-3">
              <div className="flex justify-between"><span>Distance</span><strong className="font-semibold">10.8 km</strong></div>
              <div className="flex justify-between"><span>Travel Time</span><strong className="font-semibold">25 min</strong></div>
              <div className="flex justify-between"><span>Health Score</span><strong className="text-[#E3C85A] font-bold">78 / 100</strong></div>
            </div>
          </div>

          <div className="vayu-card p-5 border-[#23443B] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#9AAEA5] uppercase">SHORTEST ROUTE</span>
              <span className="text-xs font-semibold text-[#9AAEA5]">Direct</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-heading text-[#E99A5A]">AQI 74</p>
              <p className="text-xs text-[#9AAEA5]">Moderate • High Exhaust</p>
            </div>
            <div className="space-y-1.5 text-xs text-[#F1F5EE] border-t border-[#23443B] pt-3">
              <div className="flex justify-between"><span>Distance</span><strong className="font-semibold">9.9 km</strong></div>
              <div className="flex justify-between"><span>Travel Time</span><strong className="font-semibold">27 min</strong></div>
              <div className="flex justify-between"><span>Health Score</span><strong className="text-[#E99A5A] font-bold">71 / 100</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW AIR-AWARE WORKS (3 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#B7D96B] uppercase tracking-wider">Simple Process</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F1F5EE]">How AIR-AWARE Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="vayu-card p-6 space-y-3">
            <span className="text-3xl font-extrabold font-heading text-[#B7D96B]">01</span>
            <h3 className="text-lg font-bold text-[#F1F5EE]">Choose your destination</h3>
            <p className="text-xs text-[#9AAEA5] leading-relaxed">
              Enter your start and end points via location search or map pinning.
            </p>
          </div>

          <div className="vayu-card p-6 space-y-3">
            <span className="text-3xl font-extrabold font-heading text-[#B7D96B]">02</span>
            <h3 className="text-lg font-bold text-[#F1F5EE]">Analyze environmental conditions</h3>
            <p className="text-xs text-[#9AAEA5] leading-relaxed">
              AIR-AWARE ingests real-time AQI stations, PM2.5 levels, and street layouts.
            </p>
          </div>

          <div className="vayu-card p-6 space-y-3">
            <span className="text-3xl font-extrabold font-heading text-[#B7D96B]">03</span>
            <h3 className="text-lg font-bold text-[#F1F5EE]">Navigate with confidence</h3>
            <p className="text-xs text-[#9AAEA5] leading-relaxed">
              Select the route matching your health priorities and start traveling.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="vayu-panel p-10 bg-[#0D2521] border-[#23443B] space-y-4">
          <h2 className="text-3xl font-extrabold font-heading text-[#F1F5EE]">
            Ready for cleaner, healthier navigation?
          </h2>
          <p className="text-sm text-[#9AAEA5] max-w-lg mx-auto">
            Experience environmental route planning designed for your long-term health.
          </p>
          <button
            onClick={onGetStarted}
            className="btn-primary text-sm px-6 py-3 mx-auto mt-2"
          >
            <span>Find a healthier route</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

