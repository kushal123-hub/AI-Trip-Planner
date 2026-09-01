import React from "react";
import { motion } from "framer-motion";
import { Sliders, Cpu, CheckSquare, Sparkles, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Sliders,
    title: "Define Your Preferences",
    description: "Tell us where you dream of going, your calendar dates, budget cap, and desired style—from backpacker thrills to ultra-luxury escapades.",
    badge: "Step 1: Input",
    gradient: "from-violet-600 to-indigo-600",
    glow: "rgba(139, 92, 246, 0.2)",
    highlights: ["Destination & Dates", "Custom Budget in INR", "Style & Hobby Tags"]
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Synthesis & Curation",
    description: "Our Gemini AI travel engine processes regional geography, top attractions, travel pacing, dining hotspots, and intelligent cost breakdowns.",
    badge: "Step 2: Processing",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6, 182, 212, 0.2)",
    highlights: ["Smart Time Pacing", "Hotel & Dining Matches", "Budget Optimization"]
  },
  {
    step: "03",
    icon: CheckSquare,
    title: "Live Interactive Timeline",
    description: "Receive a day-by-day interactive itinerary complete with morning/afternoon/evening schedules, interactive packing checklists, and insider tips.",
    badge: "Step 3: Adventure",
    gradient: "from-fuchsia-600 to-pink-600",
    glow: "rgba(217, 70, 239, 0.2)",
    highlights: ["Day-by-Day Accordion", "Interactive Packing List", "Direct Dashboard Sync"]
  },
];

const HowItWorksSection = ({ onGetStarted }) => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-slate-950/40 border-y border-white/5">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-violet-600/10 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>The AI Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Vision to Itinerary in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
              3 Seamless Steps
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            No more endless tabs, conflicting blog posts, or budget guesswork. Here is how RoamRes AI builds your ultimate journey.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-fuchsia-500/30 -translate-y-12 -z-10" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-slate-900/90 hover:-translate-y-2 group shadow-xl"
              >
                {/* Step badge & number */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${item.gradient} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <span className="text-4xl font-black text-white/10 group-hover:text-white/20 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10 mb-3">
                  {item.badge}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner inside How It Works */}
        <div className="mt-14 text-center">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-lg"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Ready to see it in action? Build your itinerary below</span>
            <ArrowRight className="h-4 w-4 text-violet-400" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
