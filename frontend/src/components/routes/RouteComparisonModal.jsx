import { X, Trophy, Check, ArrowRight } from "lucide-react";

export default function RouteComparisonModal({ isOpen, onClose, routesData, onSelectRoute }) {
  if (!isOpen || !routesData || !routesData.routes) return null;

  const routesList = routesData.routes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl glass-panel p-6 lg:p-8 rounded-3xl border-white/10 shadow-2xl bg-gray-950/90 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Side-by-Side Analysis</span>
          <h3 className="text-2xl font-extrabold text-white">Route Alternatives Comparison</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Metric</th>
                {routesList.map((r) => (
                  <th key={r.id} className="py-3 px-4 font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{r.name}</span>
                      {r.is_recommended && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-extrabold">
                          REC
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-400">Distance</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-3 px-4 text-white font-medium">{r.distance_km} km</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-400">Travel Duration</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-3 px-4 text-cyan-400 font-medium">{r.duration_min} min</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-400">Average AQI</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-3 px-4">
                    <span className={`font-bold ${r.avg_aqi <= 50 ? "text-emerald-400" : (r.avg_aqi <= 100 ? "text-yellow-400" : "text-red-400")}`}>
                      {r.avg_aqi}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-400">Estimated Exposure</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      r.exposure_level === "Low" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {r.exposure_level}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-400">Environmental Route Score</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-3 px-4 font-black text-lg text-emerald-400">
                    {r.health_score} / 100
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-400">Action</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-3 px-4">
                    <button
                      onClick={() => {
                        onSelectRoute(r.type || r.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-all"
                    >
                      Select Route
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
