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
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* PERSONALIZED GREETING & HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-white/10">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AIR-AWARE Intelligent Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Good evening, {user?.name || "Explorer"}.
          </h1>
          <p className="text-sm text-gray-300">
            Based on your <strong className="text-emerald-400">{profile?.route_priority || "Health First"}</strong> preference, we'll prioritize cleaner air corridors.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-gray-900 border border-white/10 text-center">
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Routes Analyzed</span>
            <span className="text-lg font-black text-white">24</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
            <span className="block text-[10px] text-emerald-400 font-bold uppercase">Exposure Reduction</span>
            <span className="text-lg font-black text-emerald-400">18%</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-gray-900 border border-white/10 text-center">
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Avg AQI</span>
            <span className="text-lg font-black text-cyan-400">42</span>
          </div>
        </div>
      </div>

      {/* DOCKED SPLIT MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SEARCH & RECOMMENDATION SIDEBAR */}
        <div className="lg:col-span-5 space-y-6">
          {/* Search Controls */}
          <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4 shadow-xl relative z-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Plan Your Route</span>

              {/* Mode Toggle Pills */}
              <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setMode("walking")}
                  className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                    mode === "walking" ? "bg-emerald-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                  title="Walking Mode"
                >
                  <Footprints className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMode("cycling")}
                  className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                    mode === "cycling" ? "bg-emerald-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                  title="Cycling Mode"
                >
                  <Bike className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMode("driving")}
                  className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                    mode === "driving" ? "bg-emerald-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                  title="Driving Mode"
                >
                  <Car className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCalculateRoutes} className="space-y-3">
              {/* Start Location Input & Dropdown */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Start Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={sourceText}
                    onFocus={async () => {
                      const res = await searchPlaces(sourceText.trim());
                      setSourceSuggestions(res);
                    }}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Type start location..."
                    className="w-full bg-gray-900 border border-white/10 rounded-xl pl-9 pr-16 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPinMode("source")}
                    className="absolute right-2 top-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-bold rounded-lg"
                  >
                    Pin
                  </button>
                </div>
                {sourceSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-gray-900 border border-emerald-500/40 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-2xl">
                    {sourceSuggestions.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          skipSourceRef.current = true;
                          setSourceText(s.display_name);
                          setSourcePoint({ lat: s.lat, lon: s.lon });
                          setSourceSuggestions([]);
                        }}
                        className="p-3 hover:bg-emerald-500/20 text-xs text-gray-100 cursor-pointer border-b border-white/5 flex items-center gap-2 font-medium"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{s.display_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input & Dropdown */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Destination</label>
                <div className="relative">
                  <Navigation className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={destinationText}
                    onFocus={async () => {
                      const res = await searchPlaces(destinationText.trim());
                      setDestSuggestions(res);
                    }}
                    onChange={(e) => setDestinationText(e.target.value)}
                    placeholder="Type destination location..."
                    className="w-full bg-gray-900 border border-white/10 rounded-xl pl-9 pr-16 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPinMode("destination")}
                    className="absolute right-2 top-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-bold rounded-lg"
                  >
                    Pin
                  </button>
                </div>
                {destSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-gray-900 border border-cyan-500/40 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-2xl">
                    {destSuggestions.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          skipDestRef.current = true;
                          setDestinationText(s.display_name);
                          setDestinationPoint({ lat: s.lat, lon: s.lon });
                          setDestSuggestions([]);
                        }}
                        className="p-3 hover:bg-cyan-500/20 text-xs text-gray-100 cursor-pointer border-b border-white/5 flex items-center gap-2 font-medium"
                      >
                        <Navigation className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>{s.display_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 rounded-xl justify-center font-bold text-sm shadow-lg shadow-emerald-500/20 mt-2"
              >
                {loading ? loadingStage : "Find Healthiest Route"}
              </button>
            </form>

            {error && <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">{error}</p>}
          </div>

          {/* PERSONALIZED RECOMMENDATION CARD */}
          {routesResult && routesResult.recommended_route && (
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-gray-900 to-gray-950 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Recommended for you</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
                    HEALTHIEST
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {routesResult.recommended_route.health_score}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {routesResult.recommended_route.name}
                </h3>
                <p className="text-xs text-emerald-300 mt-0.5">
                  {routesResult.recommended_route.distance_km} km • {routesResult.recommended_route.duration_min} min • Avg AQI {routesResult.recommended_route.avg_aqi}
                </p>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/60 p-3 rounded-xl border border-white/5">
                "{routesResult.recommended_route.explanation?.summary || "Recommended because it avoids high-AQI segments and better matches your environmental preferences."}"
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setShowWhyModal(true)}
                  className="btn-secondary text-xs py-2 px-3 justify-center font-semibold border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why this route?</span>
                </button>
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="btn-secondary text-xs py-2 px-3 justify-center font-semibold border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Compare Routes</span>
                </button>
              </div>

              <button
                onClick={handleSaveCurrentRoute}
                className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold border border-white/10 flex items-center justify-center gap-2 transition-colors"
              >
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <span>Save Route to Favorites</span>
              </button>

              {savedSuccessMsg && <p className="text-center text-xs text-emerald-400 font-bold">{savedSuccessMsg}</p>}
            </div>
          )}

          {/* ROUTE CARDS */}
          {routesResult && routesResult.routes && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate Route Options</span>
              {routesResult.routes.map((r) => {
                const isSelected = selectedRouteId === r.id || selectedRouteId === r.type;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRouteId(r.type || r.id)}
                    onMouseEnter={() => setHoveredRouteId(r.id)}
                    onMouseLeave={() => setHoveredRouteId("")}
                    className={`glass-card p-4 rounded-xl cursor-pointer flex items-center justify-between border transition-all ${
                      isSelected
                        ? "bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{r.name}</span>
                        {r.is_recommended && (
                          <span className="text-[9px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {r.distance_km} km • <strong className="text-white">{r.duration_min} min</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-lg font-black ${r.avg_aqi <= 50 ? "text-emerald-400" : (r.avg_aqi <= 100 ? "text-yellow-400" : "text-red-400")}`}>
                        AQI {r.avg_aqi}
                      </span>
                      <p className="text-[10px] font-bold text-gray-400">Score {r.health_score}/100</p>
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
