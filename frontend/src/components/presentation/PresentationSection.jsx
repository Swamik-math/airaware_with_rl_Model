import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function PresentationSection({ onLaunchDashboard }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102C27] border border-[#23443B] text-[#B7D96B] text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Core Differentiator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F1F5EE] leading-tight">
          Why AIR-AWARE Matters
        </h1>
        <p className="text-xs sm:text-sm text-[#9AAEA5]">
          A fundamental shift from pure speed to environmental health navigation.
        </p>
      </div>

      {/* COMPARISON TRIO CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Traditional Navigation */}
        <div className="vayu-card p-6 bg-[#0D2521] border-[#23443B] space-y-3">
          <span className="text-[10px] font-bold text-[#9AAEA5] uppercase tracking-wider">Traditional Maps</span>
          <h3 className="text-base font-extrabold font-heading text-[#F1F5EE]">"What's the fastest route?"</h3>
          <p className="text-xs text-[#9AAEA5] leading-relaxed">
            Optimizes solely for travel duration, routing pedestrians through high-emission arterial roads.
          </p>
          <div className="pt-1 text-xs font-bold text-[#D96B63]">Ignores air quality & pollution</div>
        </div>

        {/* 2. Generic Eco Maps */}
        <div className="vayu-card p-6 bg-[#0D2521] border-[#23443B] space-y-3">
          <span className="text-[10px] font-bold text-[#6FBF9A] uppercase tracking-wider">Generic Green Maps</span>
          <h3 className="text-base font-extrabold font-heading text-[#F1F5EE]">"What's the green route?"</h3>
          <p className="text-xs text-[#9AAEA5] leading-relaxed">
            Applies static green filters without considering individual sensitivities or real-time exposure.
          </p>
          <div className="pt-1 text-xs font-bold text-[#E3C85A]">One-size-fits-all</div>
        </div>

        {/* 3. AIR-AWARE Personal Health Navigation */}
        <div className="vayu-card p-6 bg-[#102C27] border-[#B7D96B]/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#B7D96B] uppercase tracking-wider">AIR-AWARE Navigation Engine</span>
            <Sparkles className="w-4 h-4 text-[#B7D96B]" />
          </div>
          <h3 className="text-base font-extrabold font-heading text-[#B7D96B]">"What's the healthiest route for YOU?"</h3>
          <p className="text-xs text-[#F1F5EE] leading-relaxed">
            Calculates environmental route scores using multi-factor AQI metrics tailored to individual sensitivities.
          </p>
          <div className="pt-1 text-xs font-bold text-[#B7D96B]">Personalized & Explainable</div>
        </div>
      </div>

      {/* ARCHITECTURE FLOW SUMMARY */}
      <div className="vayu-panel p-8 bg-[#0D2521] border-[#23443B] space-y-6">
        <h2 className="text-xl font-extrabold font-heading text-[#F1F5EE] text-center">System Pipeline Architecture</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center text-xs font-semibold text-[#9AAEA5]">
          <div className="p-3.5 rounded-lg bg-[#102C27] border border-[#23443B] w-full text-[#F1F5EE]">Origin + Destination</div>
          <ArrowRight className="w-4 h-4 text-[#B7D96B] hidden md:block" />
          <div className="p-3.5 rounded-lg bg-[#102C27] border border-[#23443B] w-full text-[#F1F5EE]">OSRM Directions API</div>
          <ArrowRight className="w-4 h-4 text-[#B7D96B] hidden md:block" />
          <div className="p-3.5 rounded-lg bg-[#102C27] border border-[#23443B] w-full text-[#F1F5EE]">AQI Sector Grid Sampling</div>
          <ArrowRight className="w-4 h-4 text-[#B7D96B] hidden md:block" />
          <div className="p-3.5 rounded-lg bg-[#153A33] border border-[#B7D96B]/50 text-[#B7D96B] w-full font-bold">Health Route Optimizer</div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onLaunchDashboard}
          className="btn-primary text-xs px-6 py-3 rounded-lg font-bold"
        >
          Explore AIR-AWARE Dashboard
        </button>
      </div>
    </div>
  );
}

