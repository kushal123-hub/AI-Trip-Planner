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
    gradient: "from-[#08D9D6] to-[#06a8a6]",
    glow: "rgba(8, 217, 214, 0.25)",
    highlights: ["Destination & Dates", "Custom Budget in INR", "Style & Hobby Tags"]
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Synthesis & Curation",
    description: "Our intelligent travel engine processes regional geography, top attractions, travel pacing, dining hotspots, and transparent cost breakdowns.",
    badge: "Step 2: Curation",
    gradient: "from-[#FF2E63] to-[#ff5782]",
    glow: "rgba(255, 46, 99, 0.25)",
    highlights: ["Smart Route Pacing", "Hotel & Dining Matches", "Budget Optimization"]
  },
  {
    step: "03",
    icon: CheckSquare,
    title: "Live Interactive Timeline",
    description: "Receive a day-by-day interactive itinerary complete with morning/afternoon/evening schedules, interactive packing checklists, and insider tips.",
    badge: "Step 3: Adventure",
    gradient: "from-[#08D9D6] to-[#FF2E63]",
    glow: "rgba(8, 217, 214, 0.25)",
    highlights: ["Day-by-Day Accordion", "Interactive Packing List", "Direct Dashboard Sync"]
  },
];

const HowItWorksSection = ({ onGetStarted }) => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#252A34]/40 border-y border-white/5">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#08D9D6]/10 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#08D9D6]/30 bg-[#08D9D6]/10 text-[#08D9D6] text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#08D9D6]" />
            <span>The AI Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#EAEAEA] tracking-tight">
            From Vision to Itinerary in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08D9D6] via-[#FF2E63] to-[#08D9D6]">
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
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#08D9D6]/30 via-[#FF2E63]/30 to-[#08D9D6]/30 -translate-y-12 -z-10" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative rounded-3xl border border-white/10 bg-[#252A34]/70 p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#08D9D6]/30 hover:bg-[#252A34]/90 hover:-translate-y-2 group shadow-xl"
              >
                {/* Step badge & number */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${item.gradient} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="h-full w-full bg-[#181b22] rounded-[14px] flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <span className="text-4xl font-black text-white/10 group-hover:text-[#08D9D6]/30 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#08D9D6] bg-[#08D9D6]/10 border border-[#08D9D6]/20 mb-3">
                  {item.badge}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Bullet highlights */}
                <div className="space-y-2 pt-4 border-t border-white/5 text-xs text-slate-300">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#08D9D6]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
