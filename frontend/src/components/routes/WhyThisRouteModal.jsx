import { Sparkles, CheckCircle2, ShieldCheck, X, HeartPulse } from "lucide-react";

export default function WhyThisRouteModal({ isOpen, onClose, route, healthProfile }) {
  if (!isOpen || !route) return null;

  const explanation = route.explanation || {
    title: "Why we recommend this route",
    summary: "Recommended because it minimizes estimated environmental exposure while maintaining a practical travel time for your health preferences.",
    reasons: [
      "✓ Lower estimated AQI exposure",
      "✓ Avoids high-pollution road segments",
      "✓ Customized for your Health First priority"
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-panel p-6 lg:p-8 rounded-3xl border-emerald-500/40 shadow-2xl bg-gray-950/90 relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Explainable Recommendation</span>
            <h3 className="text-xl font-extrabold text-white">{explanation.title}</h3>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-gray-900 border border-white/10 text-sm text-gray-200 leading-relaxed">
          {explanation.summary}
        </div>

        {/* Bulleted Reasons */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Factors Evaluated</span>
          <div className="space-y-2.5">
            {explanation.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-sm text-emerald-200 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{reason.replace(/^✓\s*/, "")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Stats Pill */}
        <div className="grid grid-cols-3 gap-3 text-center p-3 rounded-xl bg-gray-900 border border-white/10">
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Environmental Score</p>
            <p className="text-lg font-black text-emerald-400">{route.health_score} / 100</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Estimated AQI</p>
            <p className="text-lg font-black text-white">{route.avg_aqi}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Duration</p>
            <p className="text-lg font-black text-cyan-400">{route.duration_min} min</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary py-3 rounded-xl justify-center font-bold"
        >
          Got it, Close Explanation
        </button>
      </div>
    </div>
  );
}
