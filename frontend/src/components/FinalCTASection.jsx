import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Compass, ShieldCheck, Zap } from "lucide-react";

const FinalCTASection = ({ onStartPlanning }) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-r from-violet-900/90 via-purple-900/80 to-slate-900/90 p-8 sm:p-14 text-center shadow-2xl backdrop-blur-2xl"
        >
          {/* Ambient light circles */}
          <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-semibold backdrop-blur-md mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>Ready When You Are</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Your Dream Trip Is Just{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-cyan-300 to-white">
              One Prompt Away
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of travelers who use RoamRes AI to explore the world with precision, confidence, and unmatched ease.
          </p>

          {/* Action button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartPlanning}
              className="px-8 py-4 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Build My Itinerary Now</span>
              <ArrowRight className="h-4 w-4 text-violet-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Free to generate</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-400" /> Instant results</span>
            <span className="flex items-center gap-1.5"><Compass className="h-4 w-4 text-cyan-400" /> Fully customizable</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
