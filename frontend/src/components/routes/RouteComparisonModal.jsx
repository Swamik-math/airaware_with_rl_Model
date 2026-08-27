import { X } from "lucide-react";

export default function RouteComparisonModal({ isOpen, onClose, routesData, onSelectRoute }) {
  if (!isOpen || !routesData || !routesData.routes) return null;

  const routesList = routesData.routes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-3xl vayu-panel p-6 lg:p-8 bg-[#0D2521] border-[#23443B] relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#9AAEA5] hover:text-[#F1F5EE] hover:bg-[#153A33] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <span className="text-[10px] font-bold text-[#B7D96B] uppercase tracking-wider">Side-by-Side Analysis</span>
          <h3 className="text-xl font-extrabold font-heading text-[#F1F5EE]">Route Alternatives Breakdown</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#23443B] text-[#9AAEA5] uppercase tracking-wider">
                <th className="py-2.5 px-3">Metric</th>
                {routesList.map((r) => (
                  <th key={r.id} className="py-2.5 px-3 font-bold text-[#F1F5EE]">
                    <div className="flex items-center gap-1.5">
                      <span>{r.name}</span>
                      {r.is_recommended && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-[#B7D96B]/20 text-[#B7D96B] font-extrabold">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23443B]/60 text-[#F1F5EE]">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#9AAEA5]">Distance</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-2.5 px-3 font-medium">{r.distance_km} km</td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#9AAEA5]">Travel Duration</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-2.5 px-3 font-medium">{r.duration_min} min</td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#9AAEA5]">Average AQI</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-2.5 px-3">
                    <span className={`font-bold ${r.avg_aqi <= 50 ? "text-[#78C091]" : (r.avg_aqi <= 100 ? "text-[#E3C85A]" : "text-[#D96B63]")}`}>
                      AQI {r.avg_aqi}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#9AAEA5]">Exposure Level</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.exposure_level === "Low" ? "bg-[#78C091]/20 text-[#78C091]" : "bg-[#E3C85A]/20 text-[#E3C85A]"
                    }`}>
                      {r.exposure_level}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#9AAEA5]">Health Score</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-2.5 px-3 font-extrabold font-heading text-sm text-[#B7D96B]">
                    {r.health_score} / 100
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#9AAEA5]">Action</td>
                {routesList.map((r) => (
                  <td key={r.id} className="py-2.5 px-3">
                    <button
                      onClick={() => {
                        onSelectRoute(r.type || r.id);
                        onClose();
                      }}
                      className="px-3 py-1 rounded bg-[#B7D96B]/20 hover:bg-[#B7D96B] text-[#B7D96B] hover:text-[#071A17] border border-[#B7D96B]/30 text-xs font-semibold transition-all"
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

