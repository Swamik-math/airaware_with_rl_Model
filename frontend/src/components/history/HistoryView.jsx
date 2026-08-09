import { useState, useEffect } from "react";
import { History, Calendar, MapPin, Navigation, ArrowRight, Activity, Trash2 } from "lucide-react";
import { getRouteHistory } from "../../api/client";

export default function HistoryView({ onSelectHistoryRoute }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getRouteHistory();
        setHistoryList(data);
      } catch (err) {
        setHistoryList([
          {
            id: 1,
            source_name: "Indiranagar, Bengaluru",
            destination_name: "MG Road, Bengaluru",
            mode: "walking",
            selected_type: "healthiest",
            health_score: 94,
            avg_aqi: 42,
            distance_km: 4.2,
            duration_min: 38,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            source_name: "Koramangala 4th Block",
            destination_name: "Electronic City",
            mode: "cycling",
            selected_type: "healthiest",
            health_score: 91,
            avg_aqi: 48,
            distance_km: 11.4,
            duration_min: 45,
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Route History Log</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Your Navigation History</h1>
        </div>
        <span className="text-xs text-gray-400">Total {historyList.length} routes calculated</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading route history...</div>
      ) : (
        <div className="space-y-4">
          {historyList.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-5 rounded-2xl border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-emerald-500/40 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="capitalize px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 font-semibold text-[10px]">
                    {item.mode}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <span>{item.source_name}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span>{item.destination_name}</span>
                </div>

                <p className="text-xs text-gray-400">
                  {item.distance_km} km • {item.duration_min} min • Selected: <strong className="text-emerald-400 capitalize">{item.selected_type}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">{item.health_score}</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Health Score</p>
                </div>

                <div className="text-right pl-3 border-l border-white/10">
                  <span className="text-lg font-bold text-cyan-400">AQI {item.avg_aqi}</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Avg Exposure</p>
                </div>

                <button
                  onClick={() => onSelectHistoryRoute(item)}
                  className="btn-primary text-xs py-2 px-4 rounded-xl font-bold ml-2"
                >
                  View Route
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
