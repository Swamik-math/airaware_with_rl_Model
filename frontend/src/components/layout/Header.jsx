import { Wind, Navigation, History, Bookmark, BarChart3, User, Settings, Sun, Moon, LogOut, ShieldCheck } from "lucide-react";

export default function Header({ currentTab, onNavigate, user, onLogout, theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-lg">
      {/* Brand Logo & Tagline */}
      <div 
        onClick={() => onNavigate("landing")}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <Wind className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight group-hover:text-emerald-400 transition-colors">
              AIR-AWARE
            </span>
          </div>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Navigate healthier.</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1.5 rounded-xl border border-white/10">
        <button
          onClick={() => onNavigate("landing")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentTab === "landing" 
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" 
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => onNavigate("dashboard")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentTab === "dashboard" 
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" 
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <Navigation className="w-4 h-4" />
          Dashboard
        </button>

        <button
          onClick={() => onNavigate("history")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentTab === "history" 
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" 
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <History className="w-4 h-4" />
          History
        </button>

        <button
          onClick={() => onNavigate("saved")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentTab === "saved" 
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" 
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved
        </button>

        <button
          onClick={() => onNavigate("insights")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentTab === "insights" 
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" 
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Insights
        </button>

        <button
          onClick={() => onNavigate("presentation")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentTab === "presentation" 
              ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30" 
              : "text-cyan-400 hover:bg-cyan-500/10"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Why AIR-AWARE?
        </button>
      </nav>

      {/* User Actions & Theme */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("profile")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-white/10 hover:border-emerald-500/50 text-sm font-medium text-white transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <span className="hidden sm:inline">{user.name || "My Account"}</span>
            </button>

            <button
              onClick={() => onNavigate("settings")}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("login")}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="btn-primary text-sm px-4 py-1.5"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
