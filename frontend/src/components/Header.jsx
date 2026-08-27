import React from "react";
import { Moon, Sun, ArrowUpRight, Navigation, Menu, X } from "lucide-react";

export default function Header({ theme, onToggleTheme, activeSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: "Planner", href: "#planner" },
    { label: "Features", href: "#features" },
    { label: "Architecture", href: "#architecture" },
    { label: "FAQs", href: "#faqs" },
  ];

  return (
    <header className="matter-header-wrapper">
      <div className="matter-header-container">
        <div className="matter-header-content">
          {/* Brand Logo */}
          <a href="#home" className="matter-brand-link">
            <div className="matter-brand-icon">
              <Navigation className="size-5 text-amber-400" />
            </div>
            <span className="matter-brand-text">AirAware</span>
          </a>

          {/* Floating Pill Nav for Desktop */}
          <nav className="matter-desktop-nav">
            <ul className="matter-nav-pill-list">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`matter-nav-item ${
                      activeSection === item.href.substring(1) ? "active" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Action Controls */}
          <div className="matter-header-actions">
            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="matter-action-btn matter-theme-btn"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="size-5 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="size-5 text-slate-800 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Launch Planner CTA */}
            <a href="#planner" className="matter-cta-pill-btn">
              <span>Launch Planner</span>
              <ArrowUpRight className="size-4" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="matter-action-btn matter-mobile-toggle md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="matter-mobile-menu">
            <ul className="matter-mobile-nav-list">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="matter-mobile-nav-link"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
