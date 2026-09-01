import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sparkles, MapPin, Hotel, Utensils, CheckCircle2, Shield, Radio } from "lucide-react";

const generationPhases = [
  { text: "Analyzing regional highlights & travel pacing...", icon: MapPin, color: "text-violet-400" },
  { text: "Filtering premier stays within your budget target...", icon: Hotel, color: "text-cyan-400" },
  { text: "Curating authentic local dining & culinary spots...", icon: Utensils, color: "text-amber-400" },
  { text: "Balancing budget allocation across transit & stays...", icon: Shield, color: "text-emerald-400" },
  { text: "Synthesizing packing checklist & insider local tips...", icon: CheckCircle2, color: "text-blue-400" },
  { text: "Polishing your complete day-by-day AI dossier...", icon: Sparkles, color: "text-fuchsia-400" },
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
    <div className="relative rounded-3xl border border-violet-500/30 bg-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl text-center overflow-hidden max-w-2xl mx-auto">
      {/* Background Animated Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse-glow" />

      {/* Triple Orbital Rings & Central Hologram Compass */}
      <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
        {/* Outer Ring 1 */}
        <div className="absolute inset-0 rounded-full border border-violet-500/30 border-dashed animate-spin-slow" />
        
        {/* Middle Ring 2 */}
        <div className="absolute inset-2 rounded-full border border-cyan-400/40 border-dotted animate-spin-reverse-slow" />
        
        {/* Outer Glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 blur-lg opacity-50 animate-pulse-glow" />
        
        {/* Inner Core */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-slate-950 shadow-2xl">
          <Compass className="h-10 w-10 text-violet-400 animate-spin" style={{ animationDuration: "12s" }} />
        </div>
      </div>

      {/* Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold backdrop-blur-md mb-3 shadow-lg shadow-violet-500/20">
        <Radio className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
        <span>AI Travel Concierge in Action</span>
      </div>


      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
        Engineering Your Journey to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400">
          {destination || "Your Destination"}
        </span>
      </h3>
      
      <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
        Optimizing within your budget of <span className="text-emerald-400 font-semibold">₹{parseFloat(budget || 0).toLocaleString("en-IN")}</span> with verified route pacing and local highlights.
      </p>

      {/* Dynamic Status Progress Indicator */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden mb-4 p-0.5 border border-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 shadow-sm shadow-cyan-400"
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
            className="rounded-2xl border border-white/10 bg-slate-950/80 py-3.5 px-4 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-200 shadow-lg backdrop-blur-md"
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
