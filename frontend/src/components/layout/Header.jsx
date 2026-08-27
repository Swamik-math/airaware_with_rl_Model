import { useState } from "react";
import { Compass, Navigation, History, Bookmark, BarChart3, Settings, Sun, Moon, LogOut, Menu, X } from "lucide-react";

export default function Header({ currentTab, onNavigate, user, onLogout, theme, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#102C27] border-b border-[#23443B] px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div 
        onClick={() => handleNavClick("landing")}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="w-9 h-9 rounded-lg bg-[#B7D96B] text-[#071A17] flex items-center justify-center font-extrabold font-heading text-lg">
          A
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold font-heading text-lg tracking-tight text-[#F1F5EE]">
              AIR-AWARE
            </span>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#9AAEA5]">Environmental Health Navigation</p>
        </div>
      </div>

      {/* Desktop Navigation Items */}
      <nav className="hidden md:flex items-center gap-1 bg-[#0D2521] p-1 rounded-xl border border-[#23443B]">
        <button
          onClick={() => handleNavClick("landing")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentTab === "landing" 
              ? "bg-[#102C27] text-[#B7D96B] border border-[#23443B]" 
              : "text-[#9AAEA5] hover:text-[#F1F5EE]"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Explore
        </button>

        <button
          onClick={() => handleNavClick("insights")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentTab === "insights" 
              ? "bg-[#102C27] text-[#B7D96B] border border-[#23443B]" 
              : "text-[#9AAEA5] hover:text-[#F1F5EE]"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Insights
        </button>

        <button
          onClick={() => handleNavClick("history")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentTab === "history" 
              ? "bg-[#102C27] text-[#B7D96B] border border-[#23443B]" 
              : "text-[#9AAEA5] hover:text-[#F1F5EE]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          History
        </button>

        <button
          onClick={() => handleNavClick("saved")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentTab === "saved" 
              ? "bg-[#102C27] text-[#B7D96B] border border-[#23443B]" 
              : "text-[#9AAEA5] hover:text-[#F1F5EE]"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          Saved
        </button>
      </nav>

      {/* Right Controls & Primary CTA */}
      <div className="flex items-center gap-3">
        {/* Dashboard Primary CTA Button */}
        <button
          onClick={() => handleNavClick("dashboard")}
          className="btn-primary text-xs px-4 py-2"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-[#9AAEA5] hover:text-[#F1F5EE] hover:bg-[#153A33] transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user ? (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleNavClick("settings")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D2521] border border-[#23443B] hover:border-[#B7D96B]/50 text-xs font-medium text-[#F1F5EE] transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-[#B7D96B]/20 text-[#B7D96B] flex items-center justify-center font-bold text-[10px]">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <span>{user.name || "Account"}</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-[#D96B63] hover:bg-[#D96B63]/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleNavClick("login")}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#9AAEA5] hover:text-[#F1F5EE] transition-colors"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#F1F5EE] hover:bg-[#153A33]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0D2521] border-b border-[#23443B] p-4 space-y-2 shadow-2xl z-50">
          <button
            onClick={() => handleNavClick("landing")}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-[#F1F5EE] hover:bg-[#102C27]"
          >
            <Compass className="w-4 h-4 text-[#B7D96B]" />
            <span>Explore</span>
          </button>
          <button
            onClick={() => handleNavClick("dashboard")}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm font-bold text-[#B7D96B] bg-[#102C27]"
          >
            <Navigation className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNavClick("insights")}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-[#F1F5EE] hover:bg-[#102C27]"
          >
            <BarChart3 className="w-4 h-4 text-[#B7D96B]" />
            <span>Insights</span>
          </button>
          <button
            onClick={() => handleNavClick("history")}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-[#F1F5EE] hover:bg-[#102C27]"
          >
            <History className="w-4 h-4 text-[#B7D96B]" />
            <span>History</span>
          </button>
          <button
            onClick={() => handleNavClick("saved")}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-[#F1F5EE] hover:bg-[#102C27]"
          >
            <Bookmark className="w-4 h-4 text-[#B7D96B]" />
            <span>Saved Routes</span>
          </button>
          {!user && (
            <button
              onClick={() => handleNavClick("login")}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-[#9AAEA5] hover:bg-[#102C27]"
            >
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

