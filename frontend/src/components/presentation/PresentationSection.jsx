import { ShieldCheck, ArrowRight, Sparkles, CheckCircle2, HeartPulse, Compass, Layers } from "lucide-react";

export default function PresentationSection({ onLaunchDashboard }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Core Concept & Project Differentiator</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
          Why AIR-AWARE Matters
        </h1>
        <p className="text-base text-gray-300">
          A fundamental paradigm shift in modern navigation engineering.
        </p>
      </div>

      {/* COMPARISON TRIO CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Traditional Navigation */}
        <div className="glass-card p-6 rounded-2xl border-white/10 space-y-3 bg-gray-950/60">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Traditional Maps</span>
          <h3 className="text-xl font-bold text-gray-200">"What's the fastest route?"</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Optimizes solely for travel duration, often routing pedestrians and cyclists through congested, high-emission arterial roads.
          </p>
          <div className="pt-2 text-xs font-bold text-red-400">Ignores AQI & NO₂ exposure</div>
        </div>

        {/* 2. Generic Eco Maps */}
        <div className="glass-card p-6 rounded-2xl border-white/10 space-y-3 bg-gray-950/60">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Standard Environmental</span>
          <h3 className="text-xl font-bold text-white">"What's the green route?"</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Applies static green zone filters across all users without considering individual respiratory conditions or travel trade-offs.
          </p>
          <div className="pt-2 text-xs font-bold text-cyan-400">One-size-fits-all approach</div>
        </div>

        {/* 3. AIR-AWARE Personalized Health Navigation */}
        <div className="glass-card p-6 rounded-2xl border-emerald-500/50 space-y-3 bg-emerald-950/20 shadow-xl shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AIR-AWARE Platform</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-emerald-300">"What's the healthiest route for YOU?"</h3>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Calculates personalized environmental route scores using multi-factor AQI metrics tailored to individual health sensitivities and priorities.
          </p>
          <div className="pt-2 text-xs font-bold text-emerald-400">Fully personalized & explainable</div>
        </div>
      </div>

      {/* ARCHITECTURE FLOW SUMMARY */}
      <div className="glass-panel p-8 rounded-3xl border-white/10 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">System Pipeline Architecture</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center text-xs font-semibold text-gray-300">
          <div className="p-4 rounded-xl bg-gray-900 border border-white/10 w-full">Start + Destination</div>
          <ArrowRight className="w-5 h-5 text-emerald-400 hidden md:block" />
          <div className="p-4 rounded-xl bg-gray-900 border border-white/10 w-full">Mapbox Directions API</div>
          <ArrowRight className="w-5 h-5 text-emerald-400 hidden md:block" />
          <div className="p-4 rounded-xl bg-gray-900 border border-white/10 w-full">AQI & Density Sampling</div>
          <ArrowRight className="w-5 h-5 text-emerald-400 hidden md:block" />
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 w-full">Health Route Optimizer</div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onLaunchDashboard}
          className="btn-primary text-base px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-emerald-500/25"
        >
          Try AIR-AWARE Live Dashboard
        </button>
      </div>
    </div>
  );
}
