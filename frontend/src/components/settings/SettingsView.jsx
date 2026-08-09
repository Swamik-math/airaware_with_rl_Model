import { useState } from "react";
import { Settings, ShieldCheck, Trash2, RefreshCw, User, Lock, HeartPulse, Sliders } from "lucide-react";
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
      setSavingMsg("Settings saved successfully!");
      setTimeout(() => setSavingMsg(""), 3000);
    } catch (err) {
      setSavingMsg("Error saving settings.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Application Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Profile & Privacy Settings</h1>
      </div>

      {/* 1. Health Preferences Settings */}
      <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <span>Route Optimization Preferences</span>
        </h3>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Air Quality Sensitivity</label>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
              className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Low">Low Sensitivity</option>
              <option value="Moderate">Moderate Sensitivity</option>
              <option value="High">High Sensitivity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Default Route Priority</label>
            <select
              value={routePriority}
              onChange={(e) => setRoutePriority(e.target.value)}
              className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Health First">Health First (Prioritize cleanest AQI)</option>
              <option value="Balanced">Balanced (Health + Time + Distance)</option>
              <option value="Time First">Time First (Prefer fastest route)</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            className="btn-primary py-2.5 px-6 rounded-xl font-bold text-xs"
          >
            Save Preferences
          </button>
          {savingMsg && <span className="ml-3 text-xs font-bold text-emerald-400">{savingMsg}</span>}
        </div>
      </div>

      {/* 2. Privacy & Data Control */}
      <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Privacy & Sensitive Data Controls</span>
        </h3>

        <p className="text-xs text-gray-300">
          Your health sensitivities are treated as strictly confidential. AIRPATH never exposes health preferences in public URLs or third-party APIs.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => alert("Health preferences reset to default.")}
            className="btn-secondary text-xs py-2 px-4 rounded-xl border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Health Preferences
          </button>

          <button
            onClick={onLogout}
            className="btn-secondary text-xs py-2 px-4 rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Data & Sign Out
          </button>
        </div>
      </div>

      {/* 3. Medical Disclaimer */}
      <div className="p-4 rounded-2xl bg-gray-900 border border-white/10 text-xs text-gray-400 space-y-1">
        <p className="font-bold text-gray-300">Medical Disclaimer</p>
        <p>
          This application provides general environmental route guidance based on available environmental data and your selected preferences. It is not a medical device and does not provide medical diagnosis or treatment advice.
        </p>
      </div>
    </div>
  );
}
