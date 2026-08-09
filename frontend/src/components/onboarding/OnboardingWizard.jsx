import { useState } from "react";
import { ShieldAlert, HeartPulse, Sparkles, Check, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { updateHealthProfile } from "../../api/client";

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [sensitivity, setSensitivity] = useState("Moderate");
  const [pollutants, setPollutants] = useState(["PM2.5", "NO2"]);
  const [routePriority, setRoutePriority] = useState("Health First");
  const [saving, setSaving] = useState(false);

  const toggleCondition = (cond) => {
    if (cond === "None" || cond === "Prefer not to say") {
      setSelectedConditions([cond]);
      return;
    }
    const filtered = selectedConditions.filter(c => c !== "None" && c !== "Prefer not to say");
    if (filtered.includes(cond)) {
      setSelectedConditions(filtered.filter(c => c !== cond));
    } else {
      setSelectedConditions([...filtered, cond]);
    }
  };

  const togglePollutant = (pol) => {
    if (pollutants.includes(pol)) {
      setPollutants(pollutants.filter(p => p !== pol));
    } else {
      setPollutants([...pollutants, pol]);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    const profilePayload = {
      conditions: selectedConditions,
      air_sensitivity: sensitivity,
      priority_pollutants: pollutants,
      route_priority: routePriority
    };

    try {
      await updateHealthProfile(profilePayload);
      onComplete(profilePayload);
    } catch (err) {
      // Fallback complete even if network delay
      onComplete(profilePayload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl glass-panel p-8 lg:p-12 rounded-3xl border-white/10 shadow-2xl bg-gray-950/70 relative">
        {/* Step Indicator Progress bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Health Profile Personalization</span>
            <p className="text-xs text-gray-400 mt-0.5">Help us optimize route recommendations for your needs.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-900 px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-emerald-400">
            <span>0{step}</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400">04</span>
          </div>
        </div>

        {/* STEP 1: Health Conditions Questionnaire */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">Help us understand your environment preferences.</h2>
              <p className="text-sm text-gray-300 mt-2">
                Select any conditions or sensitivities you'd like us to consider when evaluating environmental exposure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Asthma",
                "COPD",
                "Allergic rhinitis / air-borne allergies",
                "Respiratory sensitivity",
                "Cardiovascular sensitivity",
                "Migraine sensitivity",
                "None",
                "Prefer not to say"
              ].map((cond) => {
                const isSelected = selectedConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                        : "bg-gray-900/60 border-white/10 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    <span>{cond}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Medical Disclaimer */}
            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-white/10 flex items-start gap-3 text-xs text-gray-400">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                This feature provides general environmental guidance based on available AQI metrics and is not a medical diagnosis or substitute for professional medical advice.
              </span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full btn-primary py-3 rounded-xl justify-center font-bold"
            >
              Continue to Step 2
            </button>
          </div>
        )}

        {/* STEP 2: Air Quality Sensitivity */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">How sensitive are you to poor air quality?</h2>
              <p className="text-sm text-gray-300 mt-2">
                This helps us tune the environmental penalty score when comparing route alternatives.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Low", desc: "Rarely affected by urban dust or moderate smog." },
                { label: "Moderate", desc: "Notice slight discomfort during high pollution days." },
                { label: "High", desc: "Strongly affected by poor air quality; require cleaner routes." },
                { label: "Not sure", desc: "Use standard environmental sensitivity baseline." }
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSensitivity(opt.label)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    sensitivity === opt.label
                      ? "bg-emerald-500/20 border-emerald-500 text-white shadow-md"
                      : "bg-gray-900/60 border-white/10 text-gray-300 hover:border-white/20"
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm text-white">{opt.label} Sensitivity</span>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                  </div>
                  {sensitivity === opt.label && <Check className="w-5 h-5 text-emerald-400" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary py-3 px-5 rounded-xl font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full btn-primary py-3 rounded-xl justify-center font-bold"
              >
                Continue to Step 3
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Priority Pollutants */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">Are there pollutants you'd like us to prioritize avoiding?</h2>
              <p className="text-sm text-gray-300 mt-2">
                Select any specific pollutants your profile should give extra weight to.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "PM2.5", desc: "Fine inhalable particles" },
                { name: "PM10", desc: "Coarse dust & pollen" },
                { name: "NO₂", desc: "Nitrogen dioxide exhaust" },
                { name: "O₃", desc: "Ground-level ozone" },
                { name: "CO", desc: "Carbon monoxide" },
                { name: "General pollution", desc: "Overall composite AQI" }
              ].map((pol) => {
                const isSelected = pollutants.includes(pol.name);
                return (
                  <button
                    key={pol.name}
                    type="button"
                    onClick={() => togglePollutant(pol.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-500 text-white"
                        : "bg-gray-900/60 border-white/10 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{pol.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{pol.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="btn-secondary py-3 px-5 rounded-xl font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-full btn-primary py-3 rounded-xl justify-center font-bold"
              >
                Continue to Final Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Route Priority */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">What matters most when choosing a route?</h2>
              <p className="text-sm text-gray-300 mt-2">
                This dictates the trade-off balance between environmental quality, travel time, and distance.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { title: "Health First", tag: "60% Air Quality Weight", desc: "Strongly prioritize cleaner routes even if travel time increases." },
                { title: "Balanced", tag: "40% Air Quality Weight", desc: "Balance environmental cleanliness, travel time, and distance." },
                { title: "Time First", tag: "20% Air Quality Weight", desc: "Prefer faster routes unless environmental exposure becomes significantly worse." }
              ].map((prio) => (
                <button
                  key={prio.title}
                  type="button"
                  onClick={() => setRoutePriority(prio.title)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    routePriority === prio.title
                      ? "bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                      : "bg-gray-900/60 border-white/10 text-gray-300 hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{prio.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                        {prio.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{prio.desc}</p>
                  </div>
                  {routePriority === prio.title && <Check className="w-5 h-5 text-emerald-400" />}
                </button>
              ))}
            </div>

            {/* Profile Summary Card */}
            <div className="p-4 rounded-2xl bg-gray-900/90 border border-emerald-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Your Personalized Profile Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-300 pt-1">
                <div>Sensitivity: <strong className="text-white">{sensitivity}</strong></div>
                <div>Priority: <strong className="text-white">{routePriority}</strong></div>
                <div>Pollutants: <strong className="text-white">{pollutants.join(", ")}</strong></div>
                <div>Conditions: <strong className="text-white">{selectedConditions.length ? selectedConditions.join(", ") : "None specified"}</strong></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(3)}
                className="btn-secondary py-3 px-5 rounded-xl font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="w-full btn-primary py-3.5 rounded-xl justify-center font-bold text-base shadow-xl shadow-emerald-500/30"
              >
                {saving ? "Saving Profile..." : "Find My First Route"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
