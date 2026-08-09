import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Eye, EyeOff, MapPin, Sparkles, Layers, Globe } from "lucide-react";

const MAP_STYLES = {
  google_streets: {
    name: "Google Maps Standard",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google Maps"
  },
  google_hybrid: {
    name: "Google Maps Hybrid",
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google Maps"
  },
  google_dark: {
    name: "Google Maps Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    subdomains: ["a", "b", "c", "d"],
    attribution: "&copy; CARTO & OpenStreetMap"
  }
};

export default function MapboxView({
  source,
  destination,
  routes,
  sectors = [],
  selectedRoute = "healthiest",
  hoveredRoute,
  onSelectRoute,
  onHoverRoute,
  pinMode,
  onSetPoint
}) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [currentStyleKey, setCurrentStyleKey] = useState("google_streets");
  const [showAqiLayer, setShowAqiLayer] = useState(true);
  const [activePopupInfo, setActivePopupInfo] = useState(null);

  // Initialize Map with Google Maps Tile Engine
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.5946], // Bengaluru center
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    const styleCfg = MAP_STYLES.google_streets;
    const tileLayer = L.tileLayer(styleCfg.url, {
      attribution: styleCfg.attribution,
      maxZoom: 20,
      subdomains: styleCfg.subdomains
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    map.on("click", (e) => {
      if (pinMode) {
        onSetPoint(pinMode, { lat: e.latlng.lat, lon: e.latlng.lng });
      }
    });

    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 200);

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Handle Map Style Switch (Google Streets vs Hybrid vs Dark)
  const handleSwitchStyle = (styleKey) => {
    setCurrentStyleKey(styleKey);
    const map = leafletMapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = MAP_STYLES[styleKey];
    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: 20,
      subdomains: cfg.subdomains
    }).addTo(map);

    tileLayerRef.current = newLayer;
  };

  // Update Source (A) and Destination (B) Pins
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (window._googleLeafletMarkerA) map.removeLayer(window._googleLeafletMarkerA);
    if (window._googleLeafletMarkerB) map.removeLayer(window._googleLeafletMarkerB);

    if (source && source[0] && source[1]) {
      const iconA = L.divIcon({
        className: "pin-a",
        html: `<div style="background:#10B981;color:white;width:34px;height:34px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:15px;box-shadow:0 4px 14px rgba(16,185,129,0.8);">A</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      window._googleLeafletMarkerA = L.marker([source[0], source[1]], { icon: iconA }).addTo(map);
    }

    if (destination && destination[0] && destination[1]) {
      const iconB = L.divIcon({
        className: "pin-b",
        html: `<div style="background:#06B6D4;color:white;width:34px;height:34px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:15px;box-shadow:0 4px 14px rgba(6,182,212,0.8);">B</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      window._googleLeafletMarkerB = L.marker([destination[0], destination[1]], { icon: iconB }).addTo(map);
    }

    // Fit map bounds to turn-by-turn road route
    if (source && destination && source[0] && destination[0]) {
      try {
        const bounds = L.latLngBounds([source, destination]);
        map.fitBounds(bounds, { padding: [60, 60] });
      } catch (e) {}
    }
  }, [source, destination]);

  // Render Environmental AQI Heatmap Layer
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (window._googleSectorGroup) {
      map.removeLayer(window._googleSectorGroup);
    }

    if (!showAqiLayer || !sectors.length) return;

    const group = L.layerGroup();

    sectors.forEach((s) => {
      const color = s.aqi <= 50 ? "#22C55E" : (s.aqi <= 100 ? "#FACC15" : (s.aqi <= 150 ? "#F97316" : "#EF4444"));
      const circle = L.circle([s.lat, s.lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.28,
        radius: 1300,
        stroke: true,
        weight: 1.5
      });

      circle.on("click", () => {
        setActivePopupInfo(s);
      });

      group.addLayer(circle);
    });

    group.addTo(map);
    window._googleSectorGroup = group;
  }, [sectors, showAqiLayer]);

  // Render Turn-by-Turn Road Network Vectors (Following Actual Streets)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (window._googleRouteGroup) {
      map.removeLayer(window._googleRouteGroup);
    }

    if (!routes || !routes.routes) return;

    const group = L.layerGroup();

    routes.routes.forEach((r) => {
      if (!r.coordinates || !r.coordinates.length) return;

      const isSelected = selectedRoute === r.type || selectedRoute === r.id;
      const isHovered = hoveredRoute === r.id || hoveredRoute === r.type;

      let color = r.type === "healthiest" ? "#059669" : (r.type === "fastest" ? "#2563EB" : "#9333EA");
      let weight = isSelected ? 8 : (isHovered ? 6 : 4);
      let opacity = isSelected ? 0.95 : 0.6;

      // Draw exact turn-by-turn road polyline
      const polyline = L.polyline(r.coordinates, {
        color: color,
        weight: weight,
        opacity: opacity,
        lineCap: "round",
        lineJoin: "round"
      });

      polyline.on("click", () => {
        onSelectRoute(r.type || r.id);
      });

      polyline.on("mouseover", () => {
        onHoverRoute(r.id || r.type);
      });

      polyline.on("mouseout", () => {
        onHoverRoute("");
      });

      group.addLayer(polyline);
    });

    group.addTo(map);
    window._googleRouteGroup = group;
  }, [routes, selectedRoute, hoveredRoute]);

  return (
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden border border-gray-700 glass-panel shadow-2xl">
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[550px] z-0" />

      {/* Floating Controls Header */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        {/* Style Selector */}
        <div className="flex items-center gap-1 bg-gray-900/90 p-1 rounded-xl border border-white/20 backdrop-blur-md">
          <button
            onClick={() => handleSwitchStyle("google_streets")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentStyleKey === "google_streets"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Google Map
          </button>
          <button
            onClick={() => handleSwitchStyle("google_hybrid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentStyleKey === "google_hybrid"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => handleSwitchStyle("google_dark")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentStyleKey === "google_dark"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Dark Mode
          </button>
        </div>

        {/* Layer Toggle */}
        <button
          onClick={() => setShowAqiLayer(!showAqiLayer)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shadow-lg backdrop-blur-md ${
            showAqiLayer
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              : "bg-gray-900/80 border-white/10 text-gray-300"
          }`}
        >
          {showAqiLayer ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>Environmental Layer {showAqiLayer ? "ON" : "OFF"}</span>
        </button>

        {pinMode && (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>Click map to set {pinMode} location</span>
          </div>
        )}
      </div>

      {/* Floating Sector Popup */}
      {activePopupInfo && (
        <div className="absolute top-16 left-4 z-10 glass-panel p-4 rounded-xl border-emerald-500/40 shadow-xl max-w-xs text-xs space-y-1 bg-gray-950/90 text-white">
          <div className="flex items-center justify-between font-bold text-white">
            <span>{activePopupInfo.name}</span>
            <button onClick={() => setActivePopupInfo(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <p className="text-gray-300">AQI: <strong className="text-emerald-400">{activePopupInfo.aqi}</strong> ({activePopupInfo.status})</p>
          <p className="text-gray-400">Population Density: {activePopupInfo.density?.toLocaleString()}/km²</p>
          <p className="text-[10px] text-gray-500 pt-1">Real-time Turn-by-Turn Road Network</p>
        </div>
      )}

      {/* Floating AQI Legend Pinned Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10 glass-panel p-3.5 rounded-2xl border-white/10 shadow-2xl backdrop-blur-md text-xs space-y-2 max-w-[210px] bg-gray-950/90 text-white">
        <div className="flex items-center justify-between font-bold text-gray-300 text-[11px]">
          <span>AIR QUALITY INDEX</span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="space-y-1.5 font-medium">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Good (0-50)
            </span>
          </div>
          <div className="flex items-center justify-between text-yellow-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Moderate (51-100)
            </span>
          </div>
          <div className="flex items-center justify-between text-orange-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Poor (101-150)
            </span>
          </div>
          <div className="flex items-center justify-between text-red-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Unhealthy (&gt;150)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
