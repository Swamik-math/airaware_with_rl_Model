import { useState, useEffect } from "react";
import { Bookmark, Trash2, Play } from "lucide-react";
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
      <div className="flex items-center justify-between border-b border-[#23443B] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#B7D96B] font-bold text-xs uppercase tracking-wider">
            <Bookmark className="w-4 h-4" />
            <span>Saved Favorites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F1F5EE] mt-1">Saved Clean Corridors</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#9AAEA5] text-xs">Loading saved routes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedList.map((item) => (
            <div key={item.id} className="vayu-panel p-5 bg-[#0D2521] border-[#23443B] space-y-4 relative hover:border-[#355E52] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold font-heading text-[#F1F5EE]">{item.name}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-[#9AAEA5] hover:text-[#D96B63] hover:bg-[#D96B63]/10 transition-colors"
                  title="Remove Saved Route"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-[#9AAEA5]">
                <p>From: <strong className="text-[#F1F5EE]">{item.source_name}</strong></p>
                <p>To: <strong className="text-[#F1F5EE]">{item.destination_name}</strong></p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#102C27] border border-[#23443B] text-xs">
                <div>
                  <span className="text-[10px] text-[#9AAEA5] uppercase font-bold">Distance</span>
                  <p className="text-xs font-bold text-[#F1F5EE]">{item.distance_km} km ({item.duration_min}m)</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#9AAEA5] uppercase font-bold">Avg AQI</span>
                  <p className="text-xs font-bold text-[#78C091]">AQI {item.avg_aqi}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#9AAEA5] uppercase font-bold">Health Score</span>
                  <p className="text-xs font-extrabold font-heading text-[#B7D96B]">{item.health_score}/100</p>
                </div>
              </div>

              <button
                onClick={() => onRecalculateRoute(item)}
                className="w-full btn-primary py-2 rounded-lg justify-center font-bold text-xs"
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

