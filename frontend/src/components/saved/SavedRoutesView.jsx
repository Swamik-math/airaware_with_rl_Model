import { useState, useEffect } from "react";
import { Bookmark, Navigation, MapPin, Trash2, ArrowRight, Play } from "lucide-react";
import { getSavedRoutes, deleteSavedRoute } from "../../api/client";

export default function SavedRoutesView({ onRecalculateRoute }) {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      try {
        const data = await getSavedRoutes();
        setSavedList(data);
      } catch (err) {
        setSavedList([
          {
            id: 1,
            name: "Home → Office",
            source_name: "Indiranagar, Bengaluru",
            destination_name: "MG Road, Bengaluru",
            mode: "walking",
            health_score: 94,
            avg_aqi: 42,
            distance_km: 4.2,
            duration_min: 38
          },
          {
            id: 2,
            name: "Morning Park Loop",
            source_name: "Koramangala 4th Block",
            destination_name: "Cubbon Park",
            mode: "walking",
            health_score: 96,
            avg_aqi: 38,
            distance_km: 5.8,
            duration_min: 45
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteSavedRoute(id);
      setSavedList(savedList.filter(s => s.id !== id));
    } catch (err) {
      setSavedList(savedList.filter(s => s.id !== id));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Bookmark className="w-4 h-4" />
            <span>Saved Favorites</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Your Favorite Clean Corridors</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading saved routes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedList.map((item) => (
            <div key={item.id} className="glass-panel p-6 rounded-2xl border-white/10 space-y-4 relative hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">{item.name}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Remove Saved Route"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-gray-300">
                <p>From: <strong className="text-white">{item.source_name}</strong></p>
                <p>To: <strong className="text-white">{item.destination_name}</strong></p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900 border border-white/10 text-xs">
                <div>
                  <span className="text-gray-400">Distance</span>
                  <p className="text-sm font-bold text-white">{item.distance_km} km ({item.duration_min}m)</p>
                </div>
                <div>
                  <span className="text-gray-400">Avg AQI</span>
                  <p className="text-sm font-bold text-cyan-400">{item.avg_aqi}</p>
                </div>
                <div>
                  <span className="text-gray-400">Health Score</span>
                  <p className="text-sm font-bold text-emerald-400">{item.health_score}/100</p>
                </div>
              </div>

              <button
                onClick={() => onRecalculateRoute(item)}
                className="w-full btn-primary py-2.5 rounded-xl justify-center font-bold text-xs shadow-md shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Recalculate Live Conditions</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
