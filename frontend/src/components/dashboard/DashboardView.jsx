import { useState, useEffect, useRef } from "react";
import { Navigation, MapPin, Search, Sparkles, HelpCircle, Layers, Bookmark, ArrowRight, Activity, ShieldCheck, CheckCircle2, Footprints, Bike, Car } from "lucide-react";
import MapboxView from "../map/MapboxView";
import WhyThisRouteModal from "../routes/WhyThisRouteModal";
import RouteComparisonModal from "../routes/RouteComparisonModal";
import { searchPlaces, calculateHealthRoutes, saveRoute } from "../../api/client";

export default function DashboardView({ user, profile, sectors = [] }) {
  const [sourceText, setSourceText] = useState("MG Road, Bengaluru");
  const [destinationText, setDestinationText] = useState("Electronic City, Bengaluru");
  const [mode, setMode] = useState("walking");

  const [sourcePoint, setSourcePoint] = useState({ lat: 12.9716, lon: 77.5946 });
  const [destinationPoint, setDestinationPoint] = useState({ lat: 12.8399, lon: 77.6770 });

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [error, setError] = useState("");
  const [routesResult, setRoutesResult] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState("healthiest");
  const [hoveredRouteId, setHoveredRouteId] = useState("");
  const [pinMode, setPinMode] = useState(null);

  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState("");

  const skipSourceRef = useRef(false);
  const skipDestRef = useRef(false);

  // Place Autocomplete Search
  useEffect(() => {
    if (skipSourceRef.current) { skipSourceRef.current = false; return; }
    const tid = setTimeout(async () => {
      if (sourceText.trim().length >= 1) {
        const res = await searchPlaces(sourceText.trim());
        setSourceSuggestions(res);
      } else { setSourceSuggestions([]); }
    }, 150);
    return () => clearTimeout(tid);
  }, [sourceText]);

  useEffect(() => {
    if (skipDestRef.current) { skipDestRef.current = false; return; }
    const tid = setTimeout(async () => {
      if (destinationText.trim().length >= 1) {
        const res = await searchPlaces(destinationText.trim());
        setDestSuggestions(res);
      } else { setDestSuggestions([]); }
    }, 150);
    return () => clearTimeout(tid);
  }, [destinationText]);

  // Initial Route Calculation
  useEffect(() => {
    handleCalculateRoutes();
  }, []);

  const handleCalculateRoutes = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    setLoadingStage("Analyzing route geometries...");
    setTimeout(() => setLoadingStage("Comparing environmental AQI & PM2.5 conditions..."), 400);
    setTimeout(() => setLoadingStage("Applying personalized health weights..."), 800);

    try {
      const data = await calculateHealthRoutes(sourcePoint, destinationPoint, mode, profile);
      setRoutesResult(data);
      if (data.recommended_id) {
        setSelectedRouteId(data.recommended_id);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Route calculation failed. Try another location.");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleSaveCurrentRoute = async () => {
    if (!routesResult || !routesResult.recommended_route) return;
    const rec = routesResult.recommended_route;
    try {
      await saveRoute({
        name: `${sourceText.split(",")[0]} → ${destinationText.split(",")[0]}`,
        source_name: sourceText,
        destination_name: destinationText,
        source: sourcePoint,
        destination: destinationPoint,
        mode: mode,
        health_score: rec.health_score,
        avg_aqi: rec.avg_aqi,
        distance_km: rec.distance_km,
        duration_min: rec.duration_min
      });
      setSavedSuccessMsg("Route saved to your profile!");
      setTimeout(() => setSavedSuccessMsg(""), 3000);
    } catch (err) {
      setSavedSuccessMsg("Failed to save route.");
    }
  };

  const selectedRouteObj = routesResult?.routes?.find(r => r.id === selectedRouteId || r.type === selectedRouteId) || routesResult?.recommended_route;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* PERSONALIZED GREETING & HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 vayu-panel p-5 bg-[#0D2521] border-[#23443B]">
        <div>
          <span className="text-[10px] font-bold text-[#B7D96B] uppercase tracking-wider">Air-Aware Navigation Engine</span>
          <h1 className="text-2xl font-extrabold font-heading text-[#F1F5EE] mt-0.5">
            Good evening, {user?.name || "Explorer"}.
          </h1>
          <p className="text-xs text-[#9AAEA5]">
            Optimizing routes prioritizing <strong className="text-[#B7D96B]">{profile?.route_priority || "Health First"}</strong> airflow corridors.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-[#102C27] border border-[#23443B] text-center">
            <span className="block text-[9px] text-[#9AAEA5] font-bold uppercase">Routes Evaluated</span>
            <span className="text-base font-extrabold font-heading text-[#F1F5EE]">24</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#102C27] border border-[#B7D96B]/30 text-center">
            <span className="block text-[9px] text-[#B7D96B] font-bold uppercase">Exposure Savings</span>
            <span className="text-base font-extrabold font-heading text-[#B7D96B]">18%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#102C27] border border-[#23443B] text-center">
            <span className="block text-[9px] text-[#9AAEA5] font-bold uppercase">Avg Regional AQI</span>
            <span className="text-base font-extrabold font-heading text-[#78C091]">42</span>
          </div>
        </div>
      </div>

      {/* DOCKED SPLIT MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SEARCH & RECOMMENDATION SIDEBAR */}
        <div className="lg:col-span-5 space-y-5">
          {/* Search Controls */}
          <div className="vayu-panel p-5 bg-[#0D2521] border-[#23443B] space-y-3 relative z-20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#9AAEA5] uppercase tracking-wider">Route Planner</span>

              {/* Mode Toggle Pills */}
              <div className="flex items-center gap-1 bg-[#102C27] p-1 rounded-lg border border-[#23443B]">
                <button
                  type="button"
                  onClick={() => setMode("walking")}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    mode === "walking" ? "bg-[#B7D96B] text-[#071A17]" : "text-[#9AAEA5] hover:text-[#F1F5EE]"
                  }`}
                  title="Walking Mode"
                >
                  <Footprints className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMode("cycling")}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    mode === "cycling" ? "bg-[#B7D96B] text-[#071A17]" : "text-[#9AAEA5] hover:text-[#F1F5EE]"
                  }`}
                  title="Cycling Mode"
                >
                  <Bike className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMode("driving")}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    mode === "driving" ? "bg-[#B7D96B] text-[#071A17]" : "text-[#9AAEA5] hover:text-[#F1F5EE]"
                  }`}
                  title="Driving Mode"
                >
                  <Car className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCalculateRoutes} className="space-y-3">
              {/* Start Location Input */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Start Location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#B7D96B] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={sourceText}
                    onFocus={async () => {
                      const res = await searchPlaces(sourceText.trim());
                      setSourceSuggestions(res);
                    }}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Type start location..."
                    className="w-full bg-[#071A17] border border-[#23443B] rounded-lg pl-8 pr-14 py-1.5 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
                  />
                  <button
                    type="button"
                    onClick={() => setPinMode("source")}
                    className="absolute right-1.5 top-1 px-2 py-0.5 bg-[#102C27] hover:bg-[#153A33] text-[#9AAEA5] text-[10px] font-bold rounded"
                  >
                    Pin
                  </button>
                </div>
                {sourceSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-[#0D2521] border border-[#23443B] rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl">
                    {sourceSuggestions.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          skipSourceRef.current = true;
                          setSourceText(s.display_name);
                          setSourcePoint({ lat: s.lat, lon: s.lon });
                          setSourceSuggestions([]);
                        }}
                        className="p-2.5 hover:bg-[#102C27] text-xs text-[#F1F5EE] cursor-pointer border-b border-[#23443B]/40 flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3 text-[#B7D96B] flex-shrink-0" />
                        <span className="truncate">{s.display_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Destination</label>
                <div className="relative">
                  <Navigation className="w-3.5 h-3.5 text-[#6FBF9A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={destinationText}
                    onFocus={async () => {
                      const res = await searchPlaces(destinationText.trim());
                      setDestSuggestions(res);
                    }}
                    onChange={(e) => setDestinationText(e.target.value)}
                    placeholder="Type destination..."
                    className="w-full bg-[#071A17] border border-[#23443B] rounded-lg pl-8 pr-14 py-1.5 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
                  />
                  <button
                    type="button"
                    onClick={() => setPinMode("destination")}
                    className="absolute right-1.5 top-1 px-2 py-0.5 bg-[#102C27] hover:bg-[#153A33] text-[#9AAEA5] text-[10px] font-bold rounded"
                  >
                    Pin
                  </button>
                </div>
                {destSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-[#0D2521] border border-[#23443B] rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl">
                    {destSuggestions.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          skipDestRef.current = true;
                          setDestinationText(s.display_name);
                          setDestinationPoint({ lat: s.lat, lon: s.lon });
                          setDestSuggestions([]);
                        }}
                        className="p-2.5 hover:bg-[#102C27] text-xs text-[#F1F5EE] cursor-pointer border-b border-[#23443B]/40 flex items-center gap-2"
                      >
                        <Navigation className="w-3 h-3 text-[#6FBF9A] flex-shrink-0" />
                        <span className="truncate">{s.display_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 rounded-lg justify-center text-xs mt-1"
              >
                {loading ? loadingStage : "Calculate Cleanest Route"}
              </button>
            </form>

            {error && <p className="text-xs text-[#D96B63] bg-[#D96B63]/10 p-2 rounded border border-[#D96B63]/20">{error}</p>}
          </div>

          {/* PERSONALIZED RECOMMENDATION CARD */}
          {routesResult && routesResult.recommended_route && (
            <div className="vayu-panel p-5 bg-[#0D2521] border-[#B7D96B]/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#B7D96B] uppercase tracking-wider">Top Recommendation</span>
                  <span className="text-[9px] bg-[#B7D96B]/20 text-[#B7D96B] font-extrabold px-2 py-0.5 rounded">
                    HEALTHIEST
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#B7D96B]/20 text-[#B7D96B] flex items-center justify-center font-extrabold font-heading text-xs">
                  {routesResult.recommended_route.health_score}
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold font-heading text-[#F1F5EE]">
                  {routesResult.recommended_route.name}
                </h3>
                <p className="text-xs text-[#9AAEA5] mt-0.5">
                  {routesResult.recommended_route.distance_km} km • {routesResult.recommended_route.duration_min} min • Avg AQI <strong className="text-[#78C091]">{routesResult.recommended_route.avg_aqi}</strong>
                </p>
              </div>

              <p className="text-xs text-[#9AAEA5] leading-relaxed bg-[#102C27] p-2.5 rounded-lg border border-[#23443B]">
                "{routesResult.recommended_route.explanation?.summary || "Minimizes estimated AQI exposure along your route."}"
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setShowWhyModal(true)}
                  className="btn-secondary text-[11px] py-1.5 px-2.5 justify-center font-semibold"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#B7D96B]" />
                  <span>Why this route?</span>
                </button>
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="btn-secondary text-[11px] py-1.5 px-2.5 justify-center font-semibold"
                >
                  <Layers className="w-3.5 h-3.5 text-[#6FBF9A]" />
                  <span>Compare All</span>
                </button>
              </div>

              <button
                onClick={handleSaveCurrentRoute}
                className="w-full py-2 rounded-lg bg-[#102C27] hover:bg-[#153A33] text-[#F1F5EE] text-xs font-semibold border border-[#23443B] flex items-center justify-center gap-2 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#B7D96B]" />
                <span>Save Route</span>
              </button>

              {savedSuccessMsg && <p className="text-center text-xs text-[#B7D96B] font-bold">{savedSuccessMsg}</p>}
            </div>
          )}

          {/* ROUTE CARDS */}
          {routesResult && routesResult.routes && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#9AAEA5] uppercase tracking-wider">Calculated Alternatives</span>
              {routesResult.routes.map((r) => {
                const isSelected = selectedRouteId === r.id || selectedRouteId === r.type;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRouteId(r.type || r.id)}
                    onMouseEnter={() => setHoveredRouteId(r.id)}
                    onMouseLeave={() => setHoveredRouteId("")}
                    className={`vayu-card p-3.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-[#153A33] border-[#B7D96B]"
                        : "bg-[#102C27] border-[#23443B] hover:border-[#355E52]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#F1F5EE]">{r.name}</span>
                        {r.is_recommended && (
                          <span className="text-[9px] bg-[#B7D96B]/20 text-[#B7D96B] font-bold px-1.5 py-0.5 rounded">
                            REC
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#9AAEA5] mt-0.5">
                        {r.distance_km} km • <strong className="text-[#F1F5EE]">{r.duration_min} min</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-extrabold ${r.avg_aqi <= 50 ? "text-[#78C091]" : (r.avg_aqi <= 100 ? "text-[#E3C85A]" : "text-[#D96B63]")}`}>
                        AQI {r.avg_aqi}
                      </span>
                      <p className="text-[10px] text-[#9AAEA5]">Score {r.health_score}/100</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


        {/* RIGHT MAP CANVAS */}
        <div className="lg:col-span-7 h-[540px] sticky top-20">
          <MapboxView
            source={[sourcePoint.lat, sourcePoint.lon]}
            destination={[destinationPoint.lat, destinationPoint.lon]}
            routes={routesResult}
            sectors={sectors}
            selectedRoute={selectedRouteId}
            hoveredRoute={hoveredRouteId}
            onSelectRoute={setSelectedRouteId}
            onHoverRoute={setHoveredRouteId}
            pinMode={pinMode}
            onSetPoint={(mode, coords) => {
              if (mode === "source") {
                setSourcePoint(coords);
                setSourceText(`${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`);
              } else {
                setDestinationPoint(coords);
                setDestinationText(`${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`);
              }
              setPinMode(null);
            }}
          />
        </div>
      </div>

      {/* WHY THIS ROUTE MODAL */}
      <WhyThisRouteModal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        route={selectedRouteObj}
        healthProfile={profile}
      />

      {/* ROUTE COMPARISON MODAL */}
      <RouteComparisonModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        routesData={routesResult}
        onSelectRoute={setSelectedRouteId}
      />
    </div>
  );
}
