import { useState } from "react";
import { ShieldAlert, Sparkles, Check, ChevronLeft } from "lucide-react";
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
      onComplete(profilePayload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl vayu-panel p-6 lg:p-10 bg-[#0D2521] border-[#23443B] relative">
        {/* Step Indicator Progress bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#23443B]">
          <div>
            <span className="text-[10px] font-bold text-[#B7D96B] uppercase tracking-wider">Environmental Profile Setup</span>
            <p className="text-xs text-[#9AAEA5] mt-0.5">Customize environmental optimization parameters.</p>
          </div>
          <div className="flex items-center gap-1 bg-[#102C27] px-3 py-1 rounded-md border border-[#23443B] text-xs font-bold text-[#B7D96B]">
            <span>0{step}</span>
            <span className="text-[#23443B]">/</span>
            <span className="text-[#9AAEA5]">04</span>
          </div>
        </div>

        {/* STEP 1: Health Conditions Questionnaire */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold font-heading text-[#F1F5EE]">Health Sensitivity Preferences</h2>
              <p className="text-xs text-[#9AAEA5] mt-1">
                Select any sensitivities to factor into environmental penalty calculations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                    className={`p-3 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#153A33] border-[#B7D96B] text-[#F1F5EE]"
                        : "bg-[#102C27] border-[#23443B] text-[#9AAEA5] hover:border-[#355E52]"
                    }`}
                  >
                    <span>{cond}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#B7D96B]" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-lg bg-[#071A17] border border-[#23443B] flex items-start gap-2.5 text-xs text-[#9AAEA5]">
              <ShieldAlert className="w-4 h-4 text-[#E3C85A] flex-shrink-0 mt-0.5" />
              <span>
                Provides non-medical environmental guidance based on regional air quality indicators.
              </span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full btn-primary py-2.5 rounded-lg justify-center font-bold text-xs"
            >
              Continue to Step 2
            </button>
          </div>
        )}

        {/* STEP 2: Air Quality Sensitivity */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold font-heading text-[#F1F5EE]">Air Quality Sensitivity Level</h2>
              <p className="text-xs text-[#9AAEA5] mt-1">
                Sets the environmental penalty weight when comparing route alternatives.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { label: "Low", desc: "Minimal impact from urban dust or light smog." },
                { label: "Moderate", desc: "Noticeable discomfort on high AQI days." },
                { label: "High", desc: "Strongly affected by pollution; require cleanest paths." },
                { label: "Not sure", desc: "Use balanced environmental baseline." }
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSensitivity(opt.label)}
                  className={`w-full p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    sensitivity === opt.label
                      ? "bg-[#153A33] border-[#B7D96B] text-[#F1F5EE]"
                      : "bg-[#102C27] border-[#23443B] text-[#9AAEA5] hover:border-[#355E52]"
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-[#F1F5EE]">{opt.label} Sensitivity</span>
                    <p className="text-[11px] text-[#9AAEA5] mt-0.5">{opt.desc}</p>
                  </div>
                  {sensitivity === opt.label && <Check className="w-4 h-4 text-[#B7D96B]" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary py-2 px-4 rounded-lg font-semibold text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full btn-primary py-2.5 rounded-lg justify-center font-bold text-xs"
              >
                Continue to Step 3
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Priority Pollutants */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold font-heading text-[#F1F5EE]">Priority Pollutants</h2>
              <p className="text-xs text-[#9AAEA5] mt-1">
                Select target pollutants to avoid along travel corridors.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: "PM2.5", desc: "Fine particulate matter" },
                { name: "PM10", desc: "Coarse dust & pollen" },
                { name: "NO₂", desc: "Nitrogen dioxide exhaust" },
                { name: "O₃", desc: "Ground-level ozone" },
                { name: "CO", desc: "Carbon monoxide" },
                { name: "General pollution", desc: "Composite regional AQI" }
              ].map((pol) => {
                const isSelected = pollutants.includes(pol.name);
                return (
                  <button
                    key={pol.name}
                    type="button"
                    onClick={() => togglePollutant(pol.name)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "bg-[#153A33] border-[#B7D96B] text-[#F1F5EE]"
                        : "bg-[#102C27] border-[#23443B] text-[#9AAEA5] hover:border-[#355E52]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#F1F5EE]">{pol.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#B7D96B]" />}
                    </div>
                    <p className="text-[10px] text-[#9AAEA5] mt-0.5">{pol.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="btn-secondary py-2 px-4 rounded-lg font-semibold text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-full btn-primary py-2.5 rounded-lg justify-center font-bold text-xs"
              >
                Continue to Final Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Route Priority */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold font-heading text-[#F1F5EE]">Route Optimization Objective</h2>
              <p className="text-xs text-[#9AAEA5] mt-1">
                Balance environmental quality against travel duration.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { title: "Health First", tag: "60% Clean Air Weight", desc: "Prioritize cleanest routes even with slightly longer travel time." },
                { title: "Balanced", tag: "40% Clean Air Weight", desc: "Equal balance between clean air and travel time." },
                { title: "Time First", tag: "20% Clean Air Weight", desc: "Prefer fastest route unless AQI is severely hazardous." }
              ].map((prio) => (
                <button
                  key={prio.title}
                  type="button"
                  onClick={() => setRoutePriority(prio.title)}
                  className={`w-full p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    routePriority === prio.title
                      ? "bg-[#153A33] border-[#B7D96B] text-[#F1F5EE]"
                      : "bg-[#102C27] border-[#23443B] text-[#9AAEA5] hover:border-[#355E52]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#F1F5EE]">{prio.title}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-[#B7D96B]/20 text-[#B7D96B] font-extrabold">
                        {prio.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9AAEA5] mt-0.5">{prio.desc}</p>
                  </div>
                  {routePriority === prio.title && <Check className="w-4 h-4 text-[#B7D96B]" />}
                </button>
              ))}
            </div>

            {/* Profile Summary Card */}
            <div className="p-3.5 rounded-lg bg-[#102C27] border border-[#23443B] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#B7D96B] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Profile Configuration</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[#9AAEA5] pt-0.5 text-[11px]">
                <div>Sensitivity: <strong className="text-[#F1F5EE]">{sensitivity}</strong></div>
                <div>Priority: <strong className="text-[#F1F5EE]">{routePriority}</strong></div>
                <div>Pollutants: <strong className="text-[#F1F5EE]">{pollutants.join(", ")}</strong></div>
                <div>Sensitivities: <strong className="text-[#F1F5EE]">{selectedConditions.length ? selectedConditions.join(", ") : "None"}</strong></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(3)}
                className="btn-secondary py-2 px-4 rounded-lg font-semibold text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="w-full btn-primary py-2.5 rounded-lg justify-center font-bold text-xs"
              >
                {saving ? "Saving Profile..." : "Explore Clean Routes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

