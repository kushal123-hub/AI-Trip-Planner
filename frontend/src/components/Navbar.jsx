import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  History, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  ChevronDown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AnimatedLogo from "./AnimatedLogo";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#user-dropdown-container")) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (!isLandingPage) {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#252A34]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/50 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      {/* Top Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-[#08D9D6] via-[#FF2E63] to-[#08D9D6] z-50 transition-all duration-100 shadow-[0_0_8px_rgba(8,217,214,0.6)]"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group cursor-pointer"
        >
          <AnimatedLogo size="md" />
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-[#EAEAEA] flex items-center gap-1">
              RoamRes <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08D9D6] to-[#FF2E63]">AI</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-[#08D9D6] uppercase">
              Next-Gen Travel
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        {isLandingPage ? (
          <nav className="hidden md:flex items-center gap-1 bg-[#252A34]/70 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-lg">
            <button
              onClick={() => scrollToSection("destinations")}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              Destinations
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("planner")}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              AI Planner
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("itinerary-preview")}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              Preview
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`text-sm font-medium px-3.5 py-1.5 rounded-xl transition ${
                location.pathname === "/dashboard"
                  ? "bg-[#08D9D6]/15 text-[#08D9D6] border border-[#08D9D6]/30 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/create-trip"
              className={`text-sm font-medium px-3.5 py-1.5 rounded-xl transition ${
                location.pathname === "/create-trip"
                  ? "bg-[#08D9D6]/15 text-[#08D9D6] border border-[#08D9D6]/30 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              New Journey
            </Link>
            <Link
              to="/trip-history"
              className={`text-sm font-medium px-3.5 py-1.5 rounded-xl transition ${
                location.pathname === "/trip-history"
                  ? "bg-[#08D9D6]/15 text-[#08D9D6] border border-[#08D9D6]/30 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              History
            </Link>
          </nav>
        )}

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" id="user-dropdown-container">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-3 text-sm font-medium text-white transition hover:border-[#08D9D6]/50 hover:bg-white/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#08D9D6] to-[#FF2E63] text-xs font-bold text-white uppercase shadow-sm">
                  {user?.username ? user.username[0] : "U"}
                </div>
                <span className="max-w-[100px] truncate text-xs">{user?.username || "Explorer"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/15 bg-[#252A34]/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-[#EAEAEA]">{user?.username}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-[#08D9D6] transition"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#08D9D6]" />
                    Dashboard
                  </Link>
                  <Link
                    to="/create-trip"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-[#08D9D6] transition"
                  >
                    <PlusCircle className="h-4 w-4 text-emerald-400" />
                    Create New Trip
                  </Link>
                  <Link
                    to="/trip-history"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-[#08D9D6] transition"
                  >
                    <History className="h-4 w-4 text-[#08D9D6]" />
                    My Journeys
                  </Link>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#FF2E63] hover:bg-[#FF2E63]/10 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal("login")}
                className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  if (isLandingPage) {
                    scrollToSection("planner");
                  } else {
                    navigate("/create-trip");
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2E63] to-[#ff5782] shadow-lg shadow-[#FF2E63]/30 hover:shadow-[#FF2E63]/50 hover:scale-105 active:scale-95 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Plan a Trip</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#252A34]/98 px-4 pt-3 pb-6 backdrop-blur-2xl space-y-3 animate-in slide-in-from-top-4 duration-200">
          {isLandingPage && (
            <div className="space-y-1">
              <button
                onClick={() => scrollToSection("destinations")}
                className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                Destinations
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("planner")}
                className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                AI Planner
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                Features
              </button>
            </div>
          )}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="px-3 py-1">
                <p className="text-xs font-semibold text-[#EAEAEA]">{user?.username}</p>
                <p className="text-[11px] text-slate-400">{user?.email}</p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-[#08D9D6] hover:bg-white/5 rounded-lg"
              >
                <LayoutDashboard className="h-4 w-4 text-[#08D9D6]" />
                Dashboard
              </Link>
              <Link
                to="/create-trip"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <PlusCircle className="h-4 w-4 text-emerald-400" />
                Create Trip
              </Link>
              <Link
                to="/trip-history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-[#08D9D6] hover:bg-white/5 rounded-lg"
              >
                <History className="h-4 w-4 text-[#08D9D6]" />
                Trip History
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate("/");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#FF2E63] hover:bg-[#FF2E63]/10 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("login");
                }}
                className="w-full py-2 text-center text-sm font-medium text-slate-200 border border-white/10 rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection("planner");
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-[#FF2E63] to-[#ff5782] rounded-xl shadow-lg shadow-[#FF2E63]/30"
              >
                Start Planning Free
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
