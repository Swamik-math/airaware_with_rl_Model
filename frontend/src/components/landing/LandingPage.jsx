import { motion } from "framer-motion";
import { Wind, ShieldAlert, ArrowRight, Activity, MapPin, Sparkles, Navigation, Layers, Compass, CheckCircle2, Zap, HeartPulse } from "lucide-react";

export default function LandingPage({ onGetStarted, onExploreDemo }) {
  return (
    <div className="w-full space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 lg:px-12 max-w-7xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-emerald-500/30 text-emerald-400 text-sm font-medium shadow-lg shadow-emerald-500/10"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Next-Generation Environmental Health Navigation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
        >
          Navigate <span className="text-gradient">Healthier.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Find routes designed around the air you breathe, the environment around you, and what matters to your individual health sensitivities.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={onGetStarted}
            className="btn-primary text-base px-8 py-4 rounded-xl font-bold shadow-xl shadow-emerald-500/25 group"
          >
            <span>Find My Healthiest Route</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onExploreDemo}
            className="btn-secondary text-base px-8 py-4 rounded-xl font-semibold border-white/20 hover:border-emerald-500/50"
          >
            Explore How It Works
          </button>
        </motion.div>

        {/* HERO MAP VISUALIZATION CANVAS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-12 glass-panel p-4 lg:p-6 rounded-2xl border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="relative w-full h-[420px] rounded-xl bg-gray-950 overflow-hidden flex items-center justify-center border border-white/10">
            {/* Simulated Heatmap background grid */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
            
            {/* Pollution Zones simulation */}
            <div className="absolute top-10 left-16 w-64 h-64 bg-red-500/25 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-12 right-20 w-72 h-72 bg-amber-500/25 blur-3xl rounded-full" />
            <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-emerald-500/30 blur-3xl rounded-full" />

            {/* Glowing Route Lines SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full stroke-linecap-round">
              {/* Polluted Direct Route (Red/Orange dashed) */}
              <path
                d="M 120 320 Q 300 120 720 180"
                fill="none"
                stroke="#EF4444"
                strokeWidth="4"
                strokeDasharray="8 6"
                className="opacity-70"
              />

              {/* Healthiest Eco Route (Glowing Green Solid) */}
              <path
                d="M 120 320 Q 250 380 500 360 T 720 180"
                fill="none"
                stroke="#10B981"
                strokeWidth="6"
                className="drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]"
              />
            </svg>

            {/* Animated Environmental Data Pins */}
            <div className="absolute top-20 left-1/3 glass-panel px-3 py-1.5 rounded-full flex items-center gap-2 border-red-500/40 text-xs font-semibold text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>Peenya Zone: AQI 168 (Unhealthy)</span>
            </div>

            <div className="absolute bottom-16 right-1/3 glass-panel px-3 py-1.5 rounded-full flex items-center gap-2 border-emerald-500/40 text-xs font-semibold text-emerald-400 shadow-lg shadow-emerald-500/20">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cubbon Park Corridor: AQI 38 (Good)</span>
            </div>

            <div className="absolute bottom-6 left-6 glass-panel px-4 py-2 rounded-xl flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                94
              </div>
              <div>
                <p className="text-xs font-bold text-white">Recommended Healthiest Route</p>
                <p className="text-[11px] text-gray-400">Avoids 3 high-pollution segments • 42 min</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-12 py-12">
        <div className="glass-panel p-8 lg:p-12 rounded-3xl border-white/10 bg-gradient-to-br from-gray-900/90 to-gray-950/90 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>The Invisible Risk</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                The shortest route isn't always the healthiest.
              </h2>
              <p className="text-gray-300 text-base leading-relaxed">
                Traditional maps prioritize speed over air quality. Two routes with identical distances and travel times can expose you to dramatically different levels of toxic PM2.5, NO₂, and heavy urban exhaust.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Standard navigation sends pedestrians through high-pollution congestion.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>AIR-AWARE evaluates road-level environmental factors in real-time.</span>
                </div>
              </div>
            </div>

            {/* Problem Comparison Card */}
            <div className="space-y-4">
              <div className="glass-card p-5 border-red-500/30 bg-red-950/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Fastest Direct Route</span>
                  <p className="text-lg font-bold text-white">7.2 km • 34 min</p>
                  <p className="text-xs text-gray-400">High congestion, elevated NO₂</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-red-400">AQI 106</span>
                  <p className="text-xs font-semibold text-red-300">Poor Air Quality</p>
                </div>
              </div>

              <div className="glass-card p-5 border-emerald-500/50 bg-emerald-950/20 flex items-center justify-between shadow-lg shadow-emerald-500/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AIR-AWARE Healthiest Route</span>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">RECOMMENDED</span>
                  </div>
                  <p className="text-lg font-bold text-white">7.8 km • 42 min</p>
                  <p className="text-xs text-emerald-300">Clean parkway corridor</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">AQI 42</span>
                  <p className="text-xs font-semibold text-emerald-300">Health Score 94</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ENVIRONMENTAL INTELLIGENCE BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 lg:px-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Powered by Multi-Factor Environmental Intelligence
          </h2>
          <p className="text-gray-400 text-base">
            AIR-AWARE continuously ingests and correlates multiple environmental parameters along every candidate road segment.
          </p>
        </div>

        <div className="grid-bento">
          <div className="glass-card p-6 space-y-3 border-emerald-500/20">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Air Quality Index (AQI)</h3>
            <p className="text-sm text-gray-400">Integrated real-time AQI tracking from municipal stations and hyper-local sensors.</p>
          </div>

          <div className="glass-card p-6 space-y-3 border-cyan-500/20">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">PM2.5 & NO₂ Particulates</h3>
            <p className="text-sm text-gray-400">Prioritizes avoiding dangerous micro-particles that aggravate respiratory conditions.</p>
          </div>

          <div className="glass-card p-6 space-y-3 border-amber-500/20">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Population Density</h3>
            <p className="text-sm text-gray-400">Factors in urban crowding and human density levels for cleaner airflow corridors.</p>
          </div>

          <div className="glass-card p-6 space-y-3 border-purple-500/20">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Traffic & Congestion</h3>
            <p className="text-sm text-gray-400">Incorporates live vehicle idle patterns to avoid stagnant street-level exhaust.</p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-12 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Seamless Experience</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">How AIR-AWARE Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: "01", title: "Create Your Profile", desc: "Sign up securely in under 30 seconds." },
            { num: "02", title: "Select Sensitivities", desc: "Specify asthma, allergies, or pollutant priorities." },
            { num: "03", title: "Choose Destination", desc: "Set start and end locations with Mapbox autocomplete." },
            { num: "04", title: "Navigate Healthier", desc: "Receive customized routes ranked by Environmental Route Score." },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 relative overflow-hidden group">
              <span className="text-4xl font-black text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                {item.num}
              </span>
              <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="glass-panel p-12 rounded-3xl border-emerald-500/30 bg-gradient-to-tr from-emerald-950/40 via-gray-900 to-cyan-950/40 space-y-6">
          <HeartPulse className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Your route should work for you.</h2>
          <p className="text-gray-300 max-w-xl mx-auto">Start navigating with environmental awareness tailored to your health preferences.</p>
          <button
            onClick={onGetStarted}
            className="btn-primary text-lg px-8 py-4 rounded-xl font-bold mx-auto"
          >
            Find My Healthiest Route
          </button>
        </div>
      </section>
    </div>
  );
}
