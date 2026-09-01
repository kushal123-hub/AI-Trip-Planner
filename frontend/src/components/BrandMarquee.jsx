import React from "react";
import { 
  Compass, 
  MapPin, 
  Hotel, 
  Utensils, 
  Sparkles, 
  Wallet, 
  ShieldCheck, 
  Globe, 
  Clock, 
  CheckCircle2, 
  Plane 
} from "lucide-react";

const travelPerks = [
  { name: "50,000+ Global Hotspots", category: "Worldwide Coverage", icon: Globe, color: "text-[#08D9D6]" },
  { name: "Curated Boutique Stays", category: "Handpicked Stays", icon: Hotel, color: "text-[#FF2E63]" },
  { name: "Michelin & Local Street Food", category: "Gastronomy Guide", icon: Utensils, color: "text-amber-400" },
  { name: "Paced Day-by-Day Routes", category: "Zero Travel Fatigue", icon: Compass, color: "text-[#08D9D6]" },
  { name: "Interactive Visual Maps", category: "Turn-by-Turn Ready", icon: MapPin, color: "text-[#FF2E63]" },
  { name: "Smart Budget Allocation", category: "Transparent Pricing", icon: Wallet, color: "text-emerald-400" },
  { name: "Essential Packing Lists", category: "Weather-Ready Gear", icon: CheckCircle2, color: "text-[#08D9D6]" },
  { name: "Bespoke Travel Vibes", category: "Tailored to You", icon: Sparkles, color: "text-[#FF2E63]" },
];

const BrandMarquee = () => {
  return (
    <div className="py-8 relative overflow-hidden border-y border-white/5 bg-[#252A34]/50 backdrop-blur-xl">
      {/* Left/Right Gradient Edge Masks for Infinite Fade */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#181b22] to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#181b22] to-transparent z-10" />

      {/* Marquee Track Container */}
      <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
        {/* Render twice for seamless infinite loop */}
        {[...travelPerks, ...travelPerks].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#252A34]/80 px-5 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-[#08D9D6]/40 hover:bg-[#252A34] hover:scale-105 select-none"
            >
              <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#EAEAEA] whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
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
