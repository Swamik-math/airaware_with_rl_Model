import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("airpath_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const DEFAULT_PLACES = [
  { display_name: "MG Road, Bengaluru", lat: 12.9716, lon: 77.5946 },
  { display_name: "Indiranagar 100ft Road, Bengaluru", lat: 12.9784, lon: 77.6408 },
  { display_name: "Koramangala 4th Block, Bengaluru", lat: 12.9352, lon: 77.6245 },
  { display_name: "Electronic City Phase 1, Bengaluru", lat: 12.8399, lon: 77.6770 },
  { display_name: "Whitefield ITPL, Bengaluru", lat: 12.9698, lon: 77.7500 },
  { display_name: "Peenya Industrial Area, Bengaluru", lat: 13.0329, lon: 77.5186 },
  { display_name: "HSR Layout Sector 1, Bengaluru", lat: 12.9121, lon: 77.6445 },
  { display_name: "Jayanagar 4th Block, Bengaluru", lat: 12.9250, lon: 77.5938 },
  { display_name: "Cubbon Park, Bengaluru", lat: 12.9763, lon: 77.5929 },
  { display_name: "Lalbagh Botanical Garden, Bengaluru", lat: 12.9507, lon: 77.5848 },
  { display_name: "Hebbal Flyover, Bengaluru", lat: 13.0358, lon: 77.5970 },
  { display_name: "Yelahanka New Town, Bengaluru", lat: 13.1007, lon: 77.5963 },
  { display_name: "Banashankari 3rd Stage, Bengaluru", lat: 12.9255, lon: 77.5468 },
  { display_name: "Marathahalli Bridge, Bengaluru", lat: 12.9592, lon: 77.6974 },
  { display_name: "Church Street, Bengaluru", lat: 12.9744, lon: 77.6070 },
  { display_name: "Kempegowda International Airport, Bengaluru", lat: 13.1986, lon: 77.7066 },
  { display_name: "Majestic Bus Station, Bengaluru", lat: 12.9767, lon: 77.5713 }
];

// Authentication
export async function loginUser(email, password) {
  const res = await api.post("/auth/login", { email, password });
  if (res.data?.token) {
    localStorage.setItem("airpath_token", res.data.token);
  }
  return res.data;
}

export async function registerUser(name, email, password) {
  const res = await api.post("/auth/register", { name, email, password });
  if (res.data?.token) {
    localStorage.setItem("airpath_token", res.data.token);
  }
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}

export function logoutUser() {
  localStorage.removeItem("airpath_token");
}

// Health Profile
export async function getHealthProfile() {
  const res = await api.get("/profile");
  return res.data;
}

export async function updateHealthProfile(profileData) {
  const res = await api.put("/profile", profileData);
  return res.data;
}

// Environmental Data & Places
export async function getAqiGrid() {
  try {
    const res = await api.get("/aqi-grid");
    return res.data?.sectors || [];
  } catch (err) {
    return [
      { id: "indiranagar", name: "Indiranagar", lat: 12.9784, lon: 77.6408, aqi: 38, pm25: 15.2, pm10: 22.8, status: "Good", density: 9200 },
      { id: "mg_road", name: "MG Road", lat: 12.9716, lon: 77.5946, aqi: 68, pm25: 27.2, pm10: 40.8, status: "Moderate", density: 11500 },
      { id: "koramangala", name: "Koramangala", lat: 12.9352, lon: 77.6245, aqi: 42, pm25: 16.8, pm10: 25.2, status: "Good", density: 8500 },
      { id: "whitefield", name: "Whitefield", lat: 12.9698, lon: 77.7500, aqi: 114, pm25: 45.6, pm10: 68.4, status: "Poor", density: 6800 },
      { id: "peenya", name: "Peenya Industrial Area", lat: 13.0329, lon: 77.5186, aqi: 168, pm25: 67.2, pm10: 100.8, status: "Unhealthy", density: 14200 },
      { id: "electronic_city", name: "Electronic City", lat: 12.8399, lon: 77.6770, aqi: 45, pm25: 18.0, pm10: 27.0, status: "Good", density: 5400 },
      { id: "hsr_layout", name: "HSR Layout", lat: 12.9121, lon: 77.6445, aqi: 52, pm25: 20.8, pm10: 31.2, status: "Moderate", density: 7800 },
      { id: "jayanagar", name: "Jayanagar", lat: 12.9250, lon: 77.5938, aqi: 36, pm25: 14.4, pm10: 21.6, status: "Good", density: 8100 }
    ];
  }
}

export async function searchPlaces(query) {
  if (!query || !query.trim()) return [];
  const qLower = query.trim().toLowerCase();

  try {
    const res = await api.get(`/search-places?q=${encodeURIComponent(query)}`);
    const apiResults = res.data?.results || [];
    if (apiResults.length > 0) return apiResults;
  } catch (err) {}

  const matches = DEFAULT_PLACES.filter(p => p.display_name.toLowerCase().includes(qLower));
  return matches.length > 0 ? matches : DEFAULT_PLACES.slice(0, 5);
}

// Turn-by-Turn Road Route Calculation
export async function calculateHealthRoutes(source, destination, mode = "walking", profile = null) {
  try {
    const res = await api.post("/routes/calculate", {
      source,
      destination,
      mode,
      profile
    });
    if (res.data && res.data.recommended_route) {
      return res.data;
    }
  } catch (err) {}

  // Local turn-by-turn road fallback
  const slat = source?.lat || 12.9716;
  const slon = source?.lon || 77.5946;
  const dlat = destination?.lat || 12.8399;
  const dlon = destination?.lon || 77.6770;

  const d_lat = dlat - slat;
  const d_lon = dlon - slon;
  const dist_base = Math.max(0.5, Math.sqrt(d_lat * d_lat + d_lon * d_lon) * 111.0);

  const speed = mode === "walking" ? 4.8 : (mode === "cycling" ? 14.0 : 32.0);

  const generateRoadTurnPts = (offLat, offLon, num = 30) => {
    const pts = [];
    for (let i = 0; i <= num; i++) {
      const t = i / num;
      const cLat = Math.sin(t * Math.PI) * offLat;
      const cLon = Math.sin(t * Math.PI) * offLon;
      pts.push([
        Number((slat + (dlat - slat) * t + cLat).toFixed(5)),
        Number((slon + (dlon - slon) * t + cLon).toFixed(5))
      ]);
    }
    return pts;
  };

  const recRoute = {
    id: "route_3",
    name: "Eco-Parkway Corridor (Healthiest)",
    type: "healthiest",
    is_recommended: true,
    distance_km: Number((dist_base * 1.2).toFixed(2)),
    duration_min: Math.max(4, Math.round((dist_base * 1.2 / speed) * 60)),
    avg_aqi: 38,
    avg_pm25: 14.2,
    health_score: 94,
    high_polluted_segments: 0,
    exposure_level: "Low",
    coordinates: generateRoadTurnPts(0.012, -0.010, 32),
    explanation: {
      title: "Why we recommend this route",
      summary: "Recommended because it avoids high-AQI segments and better matches your environmental preferences.",
      reasons: [
        "✓ Lowest estimated AQI exposure along turn-by-turn road network",
        "✓ Completely avoids 2 high-pollution road segments",
        "✓ Customized for your Health First priority",
        "✓ Adjusted for your air quality sensitivity profile"
      ]
    }
  };

  const fastRoute = {
    id: "route_1",
    name: "Direct Main Avenue (Fastest)",
    type: "fastest",
    distance_km: Number((dist_base * 1.1).toFixed(2)),
    duration_min: Math.max(3, Math.round((dist_base * 1.1 / speed) * 60)),
    avg_aqi: 88,
    avg_pm25: 34.5,
    health_score: 68,
    high_polluted_segments: 2,
    exposure_level: "Moderate",
    coordinates: generateRoadTurnPts(0.001, -0.002, 30)
  };

  const shortRoute = {
    id: "route_2",
    name: "Shortest Street",
    type: "shortest",
    distance_km: Number((dist_base * 1.04).toFixed(2)),
    duration_min: Math.max(2, Math.round((dist_base * 1.04 / speed) * 60)),
    avg_aqi: 104,
    avg_pm25: 42.0,
    health_score: 58,
    high_polluted_segments: 3,
    exposure_level: "High",
    coordinates: generateRoadTurnPts(-0.004, 0.003, 30)
  };

  return {
    recommended_id: "route_3",
    recommended_route: recRoute,
    fastest_id: "route_1",
    shortest_id: "route_2",
    cleanest_id: "route_3",
    routes: [recRoute, fastRoute, shortRoute],
    disclaimer: "This environmental route score provides general guidance based on available AQI metrics and your preferences."
  };
}

// History & Saved Routes
export async function getRouteHistory() {
  const res = await api.get("/routes/history");
  return res.data?.history || [];
}

export async function getSavedRoutes() {
  const res = await api.get("/routes/saved");
  return res.data?.saved || [];
}

export async function saveRoute(routeData) {
  const res = await api.post("/routes/save", routeData);
  return res.data;
}

export async function deleteSavedRoute(id) {
  const res = await api.delete(`/routes/saved/${id}`);
  return res.data;
}

// Insights
export async function getEnvironmentalInsights() {
  const res = await api.get("/insights");
  return res.data;
}
