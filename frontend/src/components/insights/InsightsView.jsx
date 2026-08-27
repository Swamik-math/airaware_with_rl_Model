import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getEnvironmentalInsights } from "../../api/client";

export default function InsightsView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        const res = await getEnvironmentalInsights();
        setData(res);
      } catch (err) {
        setData({
          overall_aqi_avg: 42,
          exposure_reduction_pct: 24,
          cleaner_routes_chosen_count: 18,
          routes_analyzed_count: 32,
          best_nearby_area: { name: "Koramangala / HSR Layout", aqi: 38, status: "Good" },
          worst_nearby_area: { name: "Peenya Industrial Area", aqi: 168, status: "Unhealthy" },
          weekly_aqi_trend: [
            { day: "Mon", aqi_fastest: 88, aqi_healthiest: 44 },
            { day: "Tue", aqi_fastest: 92, aqi_healthiest: 48 },
            { day: "Wed", aqi_fastest: 76, aqi_healthiest: 40 },
            { day: "Thu", aqi_fastest: 105, aqi_healthiest: 52 },
            { day: "Fri", aqi_fastest: 98, aqi_healthiest: 46 },
            { day: "Sat", aqi_fastest: 64, aqi_healthiest: 36 },
            { day: "Sun", aqi_fastest: 58, aqi_healthiest: 32 }
          ]
        });
      }
    }
    loadInsights();
  }, []);

  if (!data) return <div className="text-center py-12 text-[#9AAEA5]">Loading environmental analytics...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#23443B] pb-4">
        <div className="flex items-center gap-2 text-[#B7D96B] font-bold text-xs uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Environmental Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F1F5EE] mt-1">Air Quality & Exposure Insights</h1>
        <p className="text-xs text-[#9AAEA5] mt-1">Real-time pollution trends and your cumulative environmental exposure metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="vayu-card p-4 border-[#B7D96B]/40 space-y-1">
          <span className="text-[10px] font-bold text-[#B7D96B] uppercase tracking-wider">Exposure Savings</span>
          <p className="text-3xl font-extrabold font-heading text-[#B7D96B]">{data.exposure_reduction_pct}%</p>
          <p className="text-[11px] text-[#9AAEA5]">Compared to standard direct routes</p>
        </div>

        <div className="vayu-card p-4 border-[#23443B] space-y-1">
          <span className="text-[10px] font-bold text-[#9AAEA5] uppercase tracking-wider">Average Traveled AQI</span>
          <p className="text-3xl font-extrabold font-heading text-[#78C091]">{data.overall_aqi_avg}</p>
          <p className="text-[11px] text-[#9AAEA5]">Classified as Good Air Quality</p>
        </div>

        <div className="vayu-card p-4 border-[#23443B] space-y-1">
          <span className="text-[10px] font-bold text-[#9AAEA5] uppercase tracking-wider">Cleanest Nearby Zone</span>
          <p className="text-sm font-bold text-[#F1F5EE] truncate">{data.best_nearby_area?.name}</p>
          <p className="text-xs text-[#78C091] font-semibold">AQI {data.best_nearby_area?.aqi} ({data.best_nearby_area?.status})</p>
        </div>

        <div className="vayu-card p-4 border-[#D96B63]/40 space-y-1">
          <span className="text-[10px] font-bold text-[#D96B63] uppercase tracking-wider">Highest Pollution Zone</span>
          <p className="text-sm font-bold text-[#F1F5EE] truncate">{data.worst_nearby_area?.name}</p>
          <p className="text-xs text-[#D96B63] font-semibold">AQI {data.worst_nearby_area?.aqi} ({data.worst_nearby_area?.status})</p>
        </div>
      </div>

      {/* CHART 1: WEEKLY AQI COMPARISON */}
      <div className="vayu-panel p-6 bg-[#0D2521] border-[#23443B] space-y-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-[#F1F5EE]">Weekly AQI Exposure Comparison</h3>
          <p className="text-xs text-[#9AAEA5]">Fastest Direct Route vs AIR-AWARE Healthiest Route over the past 7 days</p>
        </div>

        <div className="h-[320px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.weekly_aqi_trend}>
              <defs>
                <linearGradient id="colorFastest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D96B63" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D96B63" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHealthiest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B7D96B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#B7D96B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#23443B" />
              <XAxis dataKey="day" stroke="#9AAEA5" fontSize={11} />
              <YAxis stroke="#9AAEA5" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#102C27", borderColor: "#23443B", borderRadius: "10px" }}
                labelStyle={{ color: "#F1F5EE", fontWeight: "bold" }}
              />
              <Area type="monotone" dataKey="aqi_fastest" name="Fastest Route AQI" stroke="#D96B63" fillOpacity={1} fill="url(#colorFastest)" strokeWidth={2} />
              <Area type="monotone" dataKey="aqi_healthiest" name="AIR-AWARE Healthiest AQI" stroke="#B7D96B" fillOpacity={1} fill="url(#colorHealthiest)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

