import React from "react";
import { Sparkles, Map, Cpu, Zap, Compass, ShieldCheck, Globe, Database } from "lucide-react";

const brands = [
  { name: "Google Gemini 3.6 Flash", category: "Neural Engine", icon: Sparkles, color: "text-violet-400" },
  { name: "ESRI Dark Canvas GIS", category: "Geo-Spatial Mapping", icon: Map, color: "text-cyan-400" },
  { name: "OpenStreetMap Engine", category: "Global Geocoding", icon: Globe, color: "text-emerald-400" },
  { name: "FastAPI Asynchronous Backend", category: "Sub-Second API", icon: Zap, color: "text-amber-400" },
  { name: "SQLite Itinerary Vault", category: "Persistent Storage", icon: Database, color: "text-fuchsia-400" },
  { name: "JWT Cryptographic Auth", category: "Enterprise Security", icon: ShieldCheck, color: "text-blue-400" },
  { name: "Tailwind v4 Design Tokens", category: "GPU Glassmorphism", icon: Cpu, color: "text-indigo-400" },
  { name: "Paced Route Synthesizer", category: "Transit Optimizer", icon: Compass, color: "text-rose-400" },
];

const BrandMarquee = () => {
  return (
    <div className="py-8 relative overflow-hidden border-y border-white/5 bg-slate-950/60 backdrop-blur-xl">
      {/* Left/Right Gradient Edge Masks for Infinite Fade */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#07090e] to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#07090e] to-transparent z-10" />

      {/* Marquee Track Container */}
      <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
        {/* Render twice for seamless infinite loop */}
        {[...brands, ...brands].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-violet-500/40 hover:bg-slate-900 hover:scale-105 select-none"
            >
              <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase">
                  {item.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandMarquee;
