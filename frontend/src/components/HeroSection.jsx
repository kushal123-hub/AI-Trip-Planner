import React from "react";
import { motion } from "framer-motion";
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
  Zap
} from "lucide-react";

const HeroSection = ({ onStartPlanning, onExploreDestinations }) => {
  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 overflow-hidden flex flex-col justify-center">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-violet-600/25 via-purple-600/15 to-transparent rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none absolute top-1/3 -left-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] -z-10" />
      <div className="pointer-events-none absolute bottom-10 -right-48 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-[100px] -z-10" />

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
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold backdrop-blur-md mb-6 shadow-sm shadow-violet-500/20">
              <Sparkles className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
              <span>Powered by Next-Gen Travel Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Your Next Adventure,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
                Planned by AI
              </span>{" "}
              in Seconds.
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Say goodbye to chaotic browser tabs and generic travel guides. Get bespoke day-by-day itineraries, verified accommodations, local gastronomy, and optimized budgets tailored specifically to your vibe.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onStartPlanning}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Plan Your Journey Free</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreDestinations}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-sm backdrop-blur-md hover:border-white/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="h-4 w-4 text-violet-400" />
                <span>Explore Curated Gems</span>
              </button>
            </div>

            {/* Feature Checkmarks */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero Research Stress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Smart Budget Estimation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Instant Day-by-Day Timeline</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Interactive Itinerary Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Main Interactive Showcase Card */}
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-2xl">
              {/* Header with destination and tag */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 uppercase tracking-wider">
                    <Zap className="h-3 w-3" />
                    <span>AI Generated Dossier</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">Kyoto & Arashiyama</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-rose-400" />
                    Japan • 4 Days • Cultural & Foodie
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>9.8 Match</span>
                </div>
              </div>

              {/* Mini timeline snippet */}
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-start gap-3">
                  <div className="h-7 w-7 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-bold text-violet-300">
                    D1
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">Bamboo Grove & Tenryu-ji Temple</p>
                    <p className="text-[11px] text-slate-400">Morning matcha tasting at riverbank tea house</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-start gap-3">
                  <div className="h-7 w-7 rounded-xl bg-cyan-500/30 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-300">
                    D2
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">Fushimi Inari Torii Gate Sunrise</p>
                    <p className="text-[11px] text-slate-400">Gion evening Geisha district culinary walk</p>
                  </div>
                </div>
              </div>

              {/* Budget snippet bar */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                    Budget Allocation
                  </span>
                  <span className="font-bold text-emerald-400">₹75,000 Total</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 flex overflow-hidden">
                  <div className="h-full bg-violet-500 w-[40%]" title="Hotel 40%" />
                  <div className="h-full bg-cyan-400 w-[25%]" title="Food 25%" />
                  <div className="h-full bg-amber-400 w-[20%]" title="Transit 20%" />
                  <div className="h-full bg-emerald-400 w-[15%]" title="Activities 15%" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" /> Stay 40%</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Food 25%</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Transit 20%</span>
                </div>
              </div>
            </div>

            {/* Floating Mini Badge 1 */}
            <div className="absolute -top-6 -right-4 sm:-right-6 rounded-2xl border border-white/15 bg-slate-900/90 p-3 shadow-xl backdrop-blur-xl animate-float-slow hidden sm:flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Hotel Optimization</p>
                <p className="text-xs font-bold text-white">Saved 32% Average</p>
              </div>
            </div>

            {/* Floating Mini Badge 2 */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 rounded-2xl border border-white/15 bg-slate-900/90 p-3 shadow-xl backdrop-blur-xl animate-float-delayed hidden sm:flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Local Hidden Gems</p>
                <p className="text-xs font-bold text-white">100% Curated & Safe</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Global Statistics Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl"
        >
          <div className="text-center p-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              50,000+
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">Trips Engineered</p>
          </div>
          <div className="text-center p-3 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              120+
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">Countries Supported</p>
          </div>
          <div className="text-center p-3 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              4.9 / 5
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">Explorer Satisfaction</p>
          </div>
          <div className="text-center p-3 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              &lt; 15s
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">Synthesis Speed</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
