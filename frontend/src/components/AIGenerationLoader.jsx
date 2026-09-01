import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles, MapPin, Hotel, Utensils, CheckCircle2, Shield } from "lucide-react";

const generationPhases = [
  { text: "Analyzing regional highlights & travel pacing...", icon: MapPin },
  { text: "Filtering premier stays within your budget target...", icon: Hotel },
  { text: "Curating authentic local dining & culinary spots...", icon: Utensils },
  { text: "Balancing budget allocation across transit & stays...", icon: Shield },
  { text: "Synthesizing packing checklist & insider local tips...", icon: CheckCircle2 },
  { text: "Polishing your complete day-by-day AI dossier...", icon: Sparkles },
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
      {/* Background Animated Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl animate-pulse-glow" />

      {/* Central Pulsing Orb */}
      <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 via-purple-500 to-cyan-400 blur-xl opacity-60 animate-spin-slow" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-slate-950 shadow-inner">
          <Compass className="h-12 w-12 text-violet-400 animate-spin" style={{ animationDuration: "8s" }} />
        </div>
      </div>

      {/* Header */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold backdrop-blur-md mb-3">
        <Sparkles className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
        <span>Gemini AI Travel Engine in Progress</span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        Engineering Your Journey to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
          {destination || "Your Destination"}
        </span>
      </h3>
      
      <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
        Matching your budget of <span className="text-emerald-400 font-semibold">₹{parseFloat(budget || 0).toLocaleString("en-IN")}</span> with custom day-by-day itineraries and verified recommendations.
      </p>

      {/* Dynamic Status Progress Indicator */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400"
            initial={{ width: "10%" }}
            animate={{ width: `${((phaseIndex + 1) / generationPhases.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Phase text card */}
        <motion.div
          key={phaseIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-2xl border border-white/10 bg-white/5 py-3 px-4 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-slate-200"
        >
          <CurrentIcon className="h-4 w-4 text-violet-400 animate-bounce" />
          <span>{generationPhases[phaseIndex].text}</span>
        </motion.div>
      </div>

      {/* Small reassurance note */}
      <p className="mt-6 text-[11px] text-slate-500">
        Takes roughly 10-15 seconds to construct your complete travel dossier.
      </p>
    </div>
  );
};

export default AIGenerationLoader;
