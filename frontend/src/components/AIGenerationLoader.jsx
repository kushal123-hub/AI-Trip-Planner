import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sparkles, MapPin, Hotel, Utensils, CheckCircle2, Shield, Radio } from "lucide-react";

const generationPhases = [
  { text: "Analyzing regional highlights & travel pacing...", icon: MapPin, color: "text-[#08D9D6]" },
  { text: "Filtering premier stays within your budget target...", icon: Hotel, color: "text-[#FF2E63]" },
  { text: "Curating authentic local dining & culinary spots...", icon: Utensils, color: "text-amber-400" },
  { text: "Balancing budget allocation across transit & stays...", icon: Shield, color: "text-emerald-400" },
  { text: "Synthesizing packing checklist & insider local tips...", icon: CheckCircle2, color: "text-[#08D9D6]" },
  { text: "Polishing your complete day-by-day AI dossier...", icon: Sparkles, color: "text-[#FF2E63]" },
];

const AIGenerationLoader = ({ destination, budget }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev < generationPhases.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = generationPhases[phaseIndex].icon;

  return (
    <div className="relative rounded-3xl border border-[#08D9D6]/30 bg-[#252A34]/95 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl text-center overflow-hidden max-w-2xl mx-auto">
      {/* Background Animated Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#08D9D6]/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#FF2E63]/20 blur-3xl animate-pulse-glow" />

      {/* Triple Orbital Rings & Central Hologram Compass */}
      <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
        {/* Outer Ring 1 */}
        <div className="absolute inset-0 rounded-full border border-[#08D9D6]/30 border-dashed animate-spin-slow" />
        
        {/* Middle Ring 2 */}
        <div className="absolute inset-2 rounded-full border border-[#FF2E63]/40 border-dotted animate-spin-reverse-slow" />
        
        {/* Outer Glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#08D9D6] via-[#FF2E63] to-[#08D9D6] blur-lg opacity-40 animate-pulse-glow" />
        
        {/* Inner Core */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-[#181b22] shadow-2xl">
          <Compass className="h-10 w-10 text-[#08D9D6] animate-spin" style={{ animationDuration: "12s" }} />
        </div>
      </div>

      {/* Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#08D9D6]/30 bg-[#08D9D6]/10 text-[#08D9D6] text-xs font-semibold backdrop-blur-md mb-3 shadow-lg shadow-[#08D9D6]/20">
        <Radio className="h-3.5 w-3.5 text-[#08D9D6] animate-pulse" />
        <span>AI Travel Concierge in Action</span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-[#EAEAEA] tracking-tight">
        Engineering Your Journey to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08D9D6] via-[#FF2E63] to-[#08D9D6]">
          {destination || "Your Destination"}
        </span>
      </h3>
      
      <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
        Optimizing within your budget of <span className="text-[#08D9D6] font-semibold">₹{parseFloat(budget || 0).toLocaleString("en-IN")}</span> with verified route pacing and local highlights.
      </p>

      {/* Dynamic Status Progress Indicator */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="h-2.5 w-full rounded-full bg-[#181b22] overflow-hidden mb-4 p-0.5 border border-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#08D9D6] via-[#FF2E63] to-[#08D9D6] shadow-sm shadow-[#08D9D6]"
            initial={{ width: "15%" }}
            animate={{ width: `${((phaseIndex + 1) / generationPhases.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Phase text card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phaseIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/10 bg-[#181b22]/90 py-3.5 px-4 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-200 shadow-lg backdrop-blur-md"
          >
            <CurrentIcon className={`h-4 w-4 ${generationPhases[phaseIndex].color} shrink-0 animate-bounce`} />
            <span className="text-left">{generationPhases[phaseIndex].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Small reassurance note */}
      <p className="mt-6 text-[11px] text-slate-500">
        Synthesizing high-density travel data • ~10 seconds
      </p>
    </div>
  );
};

export default AIGenerationLoader;
