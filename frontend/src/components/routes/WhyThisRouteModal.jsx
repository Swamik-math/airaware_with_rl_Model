import { Sparkles, CheckCircle2, X } from "lucide-react";

export default function WhyThisRouteModal({ isOpen, onClose, route, healthProfile }) {
  if (!isOpen || !route) return null;

  const explanation = route.explanation || {
    title: "Why we recommend this route",
    summary: "Recommended because it minimizes estimated environmental exposure while maintaining a practical travel time for your health preferences.",
    reasons: [
      "Lower estimated AQI exposure",
      "Avoids high-pollution road segments",
      "Customized for your Health First priority"
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-lg vayu-panel p-6 lg:p-8 bg-[#0D2521] border-[#23443B] relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#9AAEA5] hover:text-[#F1F5EE] hover:bg-[#153A33] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B7D96B]/20 text-[#B7D96B] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#B7D96B] uppercase tracking-wider">Explainable Optimization</span>
            <h3 className="text-lg font-extrabold font-heading text-[#F1F5EE]">{explanation.title}</h3>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-3.5 rounded-xl bg-[#102C27] border border-[#23443B] text-xs text-[#9AAEA5] leading-relaxed">
          {explanation.summary}
        </div>

        {/* Bulleted Reasons */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#9AAEA5] uppercase tracking-wider">Key Evaluated Factors</span>
          <div className="space-y-2">
            {explanation.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-[#102C27] border border-[#23443B] text-xs text-[#F1F5EE] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#B7D96B] flex-shrink-0 mt-0.5" />
                <span>{reason.replace(/^✓\s*/, "")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-3 gap-3 text-center p-3 rounded-xl bg-[#102C27] border border-[#23443B]">
          <div>
            <p className="text-[10px] text-[#9AAEA5] font-semibold uppercase">Health Score</p>
            <p className="text-base font-extrabold font-heading text-[#B7D96B]">{route.health_score} / 100</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9AAEA5] font-semibold uppercase">Estimated AQI</p>
            <p className="text-base font-extrabold font-heading text-[#78C091]">{route.avg_aqi}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9AAEA5] font-semibold uppercase">Duration</p>
            <p className="text-base font-extrabold font-heading text-[#F1F5EE]">{route.duration_min} min</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary py-2.5 rounded-xl justify-center font-bold text-xs"
        >
          Close Explanation
        </button>
      </div>
    </div>
  );
}

