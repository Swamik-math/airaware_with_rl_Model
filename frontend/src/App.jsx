import { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import LandingPage from "./components/landing/LandingPage";
import { LoginView, RegisterView } from "./components/auth/AuthPages";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import DashboardView from "./components/dashboard/DashboardView";
import HistoryView from "./components/history/HistoryView";
import SavedRoutesView from "./components/saved/SavedRoutesView";
import InsightsView from "./components/insights/InsightsView";
import SettingsView from "./components/settings/SettingsView";
import PresentationSection from "./components/presentation/PresentationSection";
import { getCurrentUser, getAqiGrid, logoutUser } from "./api/client";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("air-aware_theme") || "dark");
  const [currentTab, setCurrentTab] = useState("landing");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("air-aware_theme", theme);
  }, [theme]);

  // Load initial active session & environmental AQI grid
  useEffect(() => {
    async function initApp() {
      try {
        const grid = await getAqiGrid();
        setSectors(grid);
      } catch (e) {}

      try {
        const meData = await getCurrentUser();
        if (meData?.user) {
          setUser(meData.user);
          setProfile(meData.profile);
        }
      } catch (e) {}
    }
    initApp();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setProfile(null);
    setCurrentTab("landing");
  };

  const handleAuthSuccess = (userData, profileData, isNewUser = false) => {
    setUser(userData);
    setProfile(profileData);
    if (isNewUser || !profileData || !profileData.air_sensitivity) {
      setCurrentTab("onboarding");
    } else {
      setCurrentTab("dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] selection:bg-emerald-500 selection:text-white">
      {/* Top Sticky Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page View Router */}
      <main className="flex-1 w-full">
        {currentTab === "landing" && (
          <LandingPage
            onGetStarted={() => setCurrentTab(user ? "dashboard" : "register")}
            onExploreDemo={() => setCurrentTab("dashboard")}
          />
        )}

        {currentTab === "login" && (
          <LoginView
            onLoginSuccess={(u, p) => handleAuthSuccess(u, p, false)}
            onSwitchToRegister={() => setCurrentTab("register")}
          />
        )}

        {currentTab === "register" && (
          <RegisterView
            onRegisterSuccess={(u, p) => handleAuthSuccess(u, p, true)}
            onSwitchToLogin={() => setCurrentTab("login")}
          />
        )}

        {currentTab === "onboarding" && (
          <OnboardingWizard
            onComplete={(updatedProfile) => {
              setProfile(updatedProfile);
              setCurrentTab("dashboard");
            }}
          />
        )}

        {currentTab === "dashboard" && (
          <DashboardView
            user={user}
            profile={profile}
            sectors={sectors}
          />
        )}

        {currentTab === "history" && (
          <HistoryView
            onSelectHistoryRoute={(histItem) => {
              setCurrentTab("dashboard");
            }}
          />
        )}

        {currentTab === "saved" && (
          <SavedRoutesView
            onRecalculateRoute={(savedItem) => {
              setCurrentTab("dashboard");
            }}
          />
        )}

        {currentTab === "insights" && <InsightsView />}

        {currentTab === "settings" && (
          <SettingsView
            user={user}
            profile={profile}
            onUpdateProfile={setProfile}
            onLogout={handleLogout}
          />
        )}

        {currentTab === "presentation" && (
          <PresentationSection onLaunchDashboard={() => setCurrentTab("dashboard")} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 glass-panel py-8 px-4 lg:px-8 text-center text-xs text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AIR-AWARE</span>
            <span>— Environmental Health Navigation Platform</span>
          </div>
          <p>Designed for Personalized, Air-Aware Travel. General environmental guidance.</p>
        </div>
      </footer>
    </div>
  );
}
