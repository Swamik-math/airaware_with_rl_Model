import { useState } from "react";
import { Settings, ShieldCheck, Trash2, RefreshCw, Sliders } from "lucide-react";
import { updateHealthProfile } from "../../api/client";

export default function SettingsView({ user, profile, onUpdateProfile, onLogout }) {
  const [sensitivity, setSensitivity] = useState(profile?.air_sensitivity || "Moderate");
  const [routePriority, setRoutePriority] = useState(profile?.route_priority || "Health First");
  const [savingMsg, setSavingMsg] = useState("");

  const handleSave = async () => {
    try {
      const updated = await updateHealthProfile({
        air_sensitivity: sensitivity,
        route_priority: routePriority
      });
      onUpdateProfile(updated.profile);
      setSavingMsg("Preferences saved successfully!");
      setTimeout(() => setSavingMsg(""), 3000);
    } catch (err) {
      setSavingMsg("Error saving preferences.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-[#23443B] pb-4">
        <div className="flex items-center gap-2 text-[#B7D96B] font-bold text-xs uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F1F5EE] mt-1">Profile & Preferences</h1>
      </div>

      {/* 1. Health Preferences Settings */}
      <div className="vayu-panel p-6 bg-[#0D2521] border-[#23443B] space-y-4">
        <h3 className="text-base font-bold font-heading text-[#F1F5EE] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#B7D96B]" />
          <span>Route Optimization Tuning</span>
        </h3>

        <div className="space-y-4 pt-1">
          <div>
            <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Air Quality Sensitivity</label>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
              className="w-full bg-[#071A17] border border-[#23443B] rounded-lg px-3 py-2 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
            >
              <option value="Low">Low Sensitivity</option>
              <option value="Moderate">Moderate Sensitivity</option>
              <option value="High">High Sensitivity</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Default Route Priority</label>
            <select
              value={routePriority}
              onChange={(e) => setRoutePriority(e.target.value)}
              className="w-full bg-[#071A17] border border-[#23443B] rounded-lg px-3 py-2 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
            >
              <option value="Health First">Health First (Prioritize cleanest air)</option>
              <option value="Balanced">Balanced (Health + Travel Time)</option>
              <option value="Time First">Time First (Prefer fastest route)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="btn-primary py-2 px-5 rounded-lg text-xs font-bold"
            >
              Save Preferences
            </button>
            {savingMsg && <span className="text-xs font-bold text-[#B7D96B]">{savingMsg}</span>}
          </div>
        </div>
      </div>

      {/* 2. Privacy & Data Control */}
      <div className="vayu-panel p-6 bg-[#0D2521] border-[#23443B] space-y-4">
        <h3 className="text-base font-bold font-heading text-[#F1F5EE] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#78C091]" />
          <span>Privacy & Data Control</span>
        </h3>

        <p className="text-xs text-[#9AAEA5]">
          Your health sensitivities are strictly confidential. AIR-AWARE never exposes personal health parameters to external ad networks or third parties.
        </p>

        <div className="pt-1 flex flex-wrap gap-3">
          <button
            onClick={() => alert("Health preferences reset to default.")}
            className="btn-secondary text-xs py-2 px-4 rounded-lg font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#B7D96B]" />
            <span>Reset Preferences</span>
          </button>

          <button
            onClick={onLogout}
            className="py-2 px-4 rounded-lg bg-[#D96B63]/10 hover:bg-[#D96B63]/20 text-[#D96B63] border border-[#D96B63]/30 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 3. Medical Disclaimer */}
      <div className="p-4 rounded-xl bg-[#071A17] border border-[#23443B] text-xs text-[#9AAEA5] space-y-1">
        <p className="font-bold text-[#F1F5EE]">Medical Disclaimer</p>
        <p>
          AIR-AWARE provides environmental routing recommendations based on live AQI estimates and user parameters. It is not a medical device and does not provide medical diagnosis or treatment advice.
        </p>
      </div>
    </div>
  );
}

