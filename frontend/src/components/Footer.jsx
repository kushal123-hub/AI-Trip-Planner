import React from "react";
import { Compass, ArrowUp, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl text-slate-400 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <AnimatedLogo size="sm" />
              <span className="text-lg font-bold text-white tracking-tight">
                RoamRes <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The intelligent AI trip planner creating bespoke, day-by-day travel itineraries, smart budget allocations, and verified stays.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
              <span>Powered by FastAPI</span>
              <span>•</span>
              <span>Gemini AI</span>
              <span>•</span>
              <span>React & Tailwind</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#destinations" className="hover:text-white transition">Curated Destinations</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
              <li><a href="#planner" className="hover:text-white transition">AI Trip Planner</a></li>
              <li><a href="#features" className="hover:text-white transition">Features & Perks</a></li>
              <li><a href="#itinerary-preview" className="hover:text-white transition">Itinerary Showcase</a></li>
            </ul>
          </div>

          {/* User Account */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-white transition">User Dashboard</Link></li>
              <li><Link to="/create-trip" className="hover:text-white transition">Plan New Trip</Link></li>
              <li><Link to="/trip-history" className="hover:text-white transition">Trip History</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} RoamRes AI. Crafted for global adventurers.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
