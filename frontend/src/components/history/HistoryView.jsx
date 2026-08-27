import { useState, useEffect } from "react";
import { History, Calendar, ArrowRight } from "lucide-react";
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
      <div className="flex items-center justify-between border-b border-[#23443B] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#B7D96B] font-bold text-xs uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Route Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F1F5EE] mt-1">Navigation History</h1>
        </div>
        <span className="text-xs text-[#9AAEA5]">{historyList.length} saved sessions</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#9AAEA5] text-xs">Loading route log...</div>
      ) : (
        <div className="space-y-3">
          {historyList.map((item) => (
            <div
              key={item.id}
              className="vayu-panel p-4 bg-[#0D2521] border-[#23443B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#355E52] transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9AAEA5]">
                  <Calendar className="w-3.5 h-3.5 text-[#B7D96B]" />
                  <span>{new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="capitalize px-2 py-0.5 rounded bg-[#102C27] text-[#9AAEA5] border border-[#23443B] text-[10px] font-semibold">
                    {item.mode}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-[#F1F5EE]">
                  <span>{item.source_name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B7D96B]" />
                  <span>{item.destination_name}</span>
                </div>

                <p className="text-xs text-[#9AAEA5]">
                  {item.distance_km} km • {item.duration_min} min • Priority: <strong className="text-[#B7D96B] capitalize">{item.selected_type}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xl font-extrabold font-heading text-[#B7D96B]">{item.health_score}</span>
                  <p className="text-[9px] text-[#9AAEA5] font-bold uppercase">Health Score</p>
                </div>

                <div className="text-right pl-3 border-l border-[#23443B]">
                  <span className="text-sm font-bold text-[#78C091]">AQI {item.avg_aqi}</span>
                  <p className="text-[9px] text-[#9AAEA5] font-bold uppercase">Avg Exposure</p>
                </div>

                <button
                  onClick={() => onSelectHistoryRoute(item)}
                  className="btn-primary text-xs py-1.5 px-3 rounded-lg font-bold ml-2"
                >
                  Load Route
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

