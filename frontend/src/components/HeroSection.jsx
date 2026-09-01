import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Wallet, 
  Compass, 
  Star, 
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  Plane
} from "lucide-react";

const rotatingDestinations = [
  "Kyoto's Ancient Temples",
  "The Amalfi Coast Cliffs",
  "Swiss Alpine Peaks",
  "Bali's Secret Waterfalls",
  "Santorini Sunsets",
  "Parisian Hidden Cafés"
];

const HeroSection = ({ onStartPlanning, onExploreDestinations }) => {
  const [destIndex, setDestIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDestIndex((prev) => (prev + 1) % rotatingDestinations.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 overflow-hidden flex flex-col justify-center">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-600/30 via-fuchsia-600/15 to-transparent rounded-full blur-[140px] -z-10 animate-pulse-glow" />
      <div className="pointer-events-none absolute top-1/4 -left-48 w-[450px] h-[450px] bg-cyan-500/20 rounded-full blur-[120px] -z-10 animate-float-slow" />
      <div className="pointer-events-none absolute bottom-10 -right-48 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-[120px] -z-10 animate-float-slow" />

      {/* Grid Pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            {/* Live Intelligence Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold backdrop-blur-md mb-6 shadow-lg shadow-violet-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>Next-Gen Travel Engine • Gemini 3.6 Flash</span>
            </div>

            {/* Main Headline with Animated Rotating Destinations */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Experience{" "}
              <span className="relative inline-block min-w-[280px] sm:min-w-[360px] text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={destIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="inline-block"
                  >
                    {rotatingDestinations[destIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              Tailored by AI in Seconds.
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Transform your travel dreams into structured, day-by-day itineraries with interactive route maps, handpicked stays, culinary recommendations, and smart financial breakdown.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onStartPlanning}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 text-white font-bold text-sm shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Plan Your Journey Free</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreDestinations}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-sm backdrop-blur-md hover:border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="h-4 w-4 text-cyan-400" />
                <span>Explore Curated Gems</span>
              </button>
            </div>

            {/* Feature Checkmarks */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero Research Friction</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Interactive Route Map</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Smart Budget Estimation</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating 3D Interactive Itinerary Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Main Interactive Showcase Card */}
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/85 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-violet-500/40">
              {/* Header with destination and tag */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 uppercase tracking-wider">
                    <Zap className="h-3 w-3" />
                    <span>AI Dossier Preview</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">Kyoto & Arashiyama</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-rose-400" />
                    Japan • 4 Days • Cultural & Culinary
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>9.9 Match</span>
                </div>
              </div>

              {/* Snapshot Timeline item */}
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-violet-300">Day 1 • Morning Highlight</span>
                    <span className="text-[10px] text-slate-400">08:30 AM</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-snug">
                    Morning walk through Arashiyama Bamboo Grove followed by Matcha tasting at Tenryu-ji temple garden.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-cyan-300">Day 1 • Evening Gastronomy</span>
                    <span className="text-[10px] text-slate-400">07:00 PM</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-snug">
                    Riverside Kaiseki dinner in Gion with seasonal Kyoto delicacies and lantern-lit alleyway stroll.
                  </p>
                </div>
              </div>

              {/* Budget & Route Footer */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-medium">Estimated Budget</span>
                  <p className="text-base font-extrabold text-emerald-400">₹72,000 <span className="text-[10px] text-slate-400 font-normal">/ person</span></p>
                </div>

                <button
                  type="button"
                  onClick={onStartPlanning}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-violet-600/30"
                >
                  <span>Customize</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Floating Live Badge 1: Top Right */}
            <div className="hidden sm:flex absolute -top-5 -right-6 rounded-2xl border border-white/15 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl animate-float">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400">Global Coverage</p>
                  <p className="text-xs font-bold text-white">190+ Countries</p>
                </div>
              </div>
            </div>

            {/* Floating Live Badge 2: Bottom Left */}
            <div className="hidden sm:flex absolute -bottom-5 -left-6 rounded-2xl border border-white/15 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl animate-float-slow">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                  <Plane className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400">Smart Route Engine</p>
                  <p className="text-xs font-bold text-white">Paced Daily Stops</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
