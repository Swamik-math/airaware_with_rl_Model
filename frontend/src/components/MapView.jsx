import { Fragment, useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet default marker icon paths in React-Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const MAP_TILE_URL =
  import.meta.env.VITE_MAP_TILE_URL ||
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const MAP_ATTRIBUTION =
  import.meta.env.VITE_MAP_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Helper for AQI color coding
export function getAqiColor(aqi) {
  if (aqi <= 50) return "#22C55E";   // Clean Green
  if (aqi <= 100) return "#FACC15";  // Moderate Yellow
  if (aqi <= 150) return "#F97316";  // Poor Orange
  if (aqi <= 200) return "#EF4444";  // Unhealthy Red
  return "#991B1B";                  // Hazardous Maroon
}

export function getAqiStatus(aqi) {
  if (aqi <= 50) return "Clean / Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Poor / Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  return "Hazardous";
}

function createStationIcon(aqi, name) {
  const color = getAqiColor(aqi);
  return L.divIcon({
    className: "custom-aqi-station-icon",
    html: `
      <div style="
        background: ${color};
        color: #ffffff;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: #fff;"></span>
        <span>${aqi}</span>
      </div>
    `,
    iconSize: [40, 24],
    iconAnchor: [20, 12]
  });
}

function normalizePoint(point) {
  if (!Array.isArray(point) || point.length !== 2) return null;
  const a = Number(point[0]);
  const b = Number(point[1]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return [a, b];
  if (Math.abs(b) <= 90 && Math.abs(a) <= 180) return [b, a];
  return null;
}

function resolveRouteGeometry(route, source, destination) {
  const normalized = (route?.geometry || []).map(normalizePoint).filter(Boolean);
  if (normalized.length >= 2) return normalized;
  if (Array.isArray(source) && Array.isArray(destination)) return [source, destination];
  return [];
}

const BENGALURU_BOUNDS = [
  [12.75, 77.35],
  [13.2, 77.85]
];

function FitRouteView({ source, destination, routes, selectedRoute }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const selectedGeometry = resolveRouteGeometry(routes?.[selectedRoute], source, destination);
    const points = [];

    if (Array.isArray(source) && source.length === 2) points.push(source);
    if (Array.isArray(destination) && destination.length === 2) points.push(destination);
    if (selectedGeometry.length > 0) points.push(...selectedGeometry);

    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 15, animate: true, duration: 1.1 });
    } else if (points.length === 1) {
      map.setView(points[0], 14, { animate: true, duration: 1.1 });
    } else {
      map.fitBounds(BENGALURU_BOUNDS, { padding: [20, 20], animate: true, duration: 1.1 });
    }
  }, [map, source, destination, routes, selectedRoute]);

  return null;
}

function MapClickListener({ pinMode, onSetPoint }) {
  useMapEvents({
    click(e) {
      if (!pinMode) return;
      onSetPoint(pinMode, { lat: e.latlng.lat, lon: e.latlng.lng });
    }
  });
  return null;
}

export default function MapView({
  source,
  destination,
  routes,
  sectors = [],
  animationToken,
  selectedRoute,
  hoveredRoute,
  onSelectRoute,
  onHoverRoute,
  pinMode,
  onSetPoint
}) {
  const center = source || [12.9716, 77.5946];
  const routeEntries = routes
    ? Object.entries(routes).filter(([key]) => ["shortest", "fastest", "healthiest"].includes(key))
    : [];

  const orderedRoutes = [
    ...routeEntries.filter(([key]) => key !== selectedRoute),
    ...routeEntries.filter(([key]) => key === selectedRoute)
  ];

  return (
    <div className={`map-shell ${pinMode ? "pin-picking-active" : ""}`}>
      <MapContainer
        center={center}
        zoom={13}
        minZoom={10}
        maxZoom={18}
        maxBounds={BENGALURU_BOUNDS}
        maxBoundsViscosity={0.85}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", minHeight: "550px" }}
      >
        <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_TILE_URL} />
        <FitRouteView source={source} destination={destination} routes={routes} selectedRoute={selectedRoute} />
        <MapClickListener pinMode={pinMode} onSetPoint={onSetPoint} />

        {/* 1. ENVIRONMENTAL HEATMAP OVERLAY LAYER */}
        {sectors.map((sec) => {
          const color = getAqiColor(sec.aqi);
          return (
            <Fragment key={`heat-${sec.id}`}>
              <Circle
                center={[sec.lat, sec.lon]}
                radius={2800}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.28,
                  color: color,
                  opacity: 0.5,
                  weight: 1.5
                }}
              />
              <Marker
                position={[sec.lat, sec.lon]}
                icon={createStationIcon(sec.aqi, sec.name)}
              >
                <Popup className="env-region-popup">
                  <div className="env-popup-card">
                    <h3 className="env-popup-title">{sec.name}</h3>
                    <div className="env-popup-row">
                      <span>Air Quality Index</span>
                      <strong style={{ color: getAqiColor(sec.aqi) }}>AQI {sec.aqi}</strong>
                    </div>
                    <div className="env-popup-row">
                      <span>Condition</span>
                      <strong>{getAqiStatus(sec.aqi)}</strong>
                    </div>
                    <div className="env-popup-row">
                      <span>Population Density</span>
                      <strong>{sec.density ? `${sec.density.toLocaleString()}/km²` : "7,500/km²"}</strong>
                    </div>
                    <div className="env-popup-row">
                      <span>Health Risk</span>
                      <strong style={{ color: getAqiColor(sec.aqi) }}>
                        {sec.aqi <= 50 ? "LOW" : sec.aqi <= 100 ? "MODERATE" : "HIGH"}
                      </strong>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </Fragment>
          );
        })}

        {/* 2. SOURCE & DESTINATION MARKERS */}
        {source && (
          <Marker position={source}>
            <Popup>📍 Source Location</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={destination}>
            <Popup>◎ Destination Location</Popup>
          </Marker>
        )}

        {/* 3. POLYLINE ROUTES LAYER */}
        {orderedRoutes.map(([key, route]) => {
          const isSelected = key === selectedRoute;
          const isHovered = key === hoveredRoute;
          const geometry = resolveRouteGeometry(route, source, destination);

          let strokeColor = "#3b82f6";
          if (key === "healthiest") strokeColor = "#10b981"; // Bright Green for Healthiest
          if (key === "fastest") strokeColor = "#f59e0b";   // Orange for Fastest

          return (
            <Fragment key={`route-${key}-${animationToken}`}>
              {/* Outer Glow / Aura for Healthiest / Selected Route */}
              {isSelected && (
                <Polyline
                  positions={geometry}
                  pathOptions={{
                    color: key === "healthiest" ? "#34d399" : "#ffffff",
                    weight: key === "healthiest" ? 14 : 10,
                    opacity: key === "healthiest" ? 0.6 : 0.8
                  }}
                />
              )}

              {/* Main Polyline */}
              <Polyline
                positions={geometry}
                eventHandlers={{
                  click: () => onSelectRoute?.(key),
                  mouseover: () => onHoverRoute?.(key),
                  mouseout: () => onHoverRoute?.("")
                }}
                pathOptions={{
                  color: strokeColor,
                  lineCap: "round",
                  lineJoin: "round",
                  weight: isSelected ? 8 : isHovered ? 6 : 4,
                  opacity: isSelected ? 1.0 : isHovered ? 0.8 : 0.45,
                  dashArray: isSelected || isHovered ? undefined : "6 8"
                }}
              />
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
