import React from "react";
import { motion } from "framer-motion";
import { 
  Coins, 
  CalendarClock, 
  CheckCircle2, 
  Hotel, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Luggage, 
  MapPin, 
  Zap,
  TrendingDown
} from "lucide-react";

const features = [
  {
    icon: Coins,
    title: "Smart Budget Optimization",
    description: "Every trip is automatically distributed into realistic percentages for stays, food, transportation, and activities—preventing unexpected expenses.",
    badge: "Cost Intelligence",
    gradient: "from-emerald-500 to-teal-400",
    accent: "text-emerald-400",
    cols: "lg:col-span-4",
  },
  {
    icon: CalendarClock,
    title: "Paced Daily Timelines",
    description: "No frantic running between attractions. Our AI groups nearby sights logically into morning, afternoon, and evening blocks for effortless flow.",
    badge: "Smart Pacing",
    gradient: "from-violet-600 to-purple-500",
    accent: "text-violet-400",
    cols: "lg:col-span-8",
  },
  {
    icon: Hotel,
    title: "Curated Hotels & Dining",
    description: "Discover verified accommodations that match your style, along with must-try local gastronomy and iconic street food corners.",
    badge: "Hospitality & Food",
    gradient: "from-cyan-500 to-blue-500",
    accent: "text-cyan-400",
    cols: "lg:col-span-8",
  },
  {
    icon: Luggage,
    title: "Interactive Packing Checklists",
    description: "Weather-aware gear recommendations and checklist items you can check off right on your mobile screen before heading out.",
    badge: "Preparation",
    gradient: "from-pink-500 to-rose-400",
    accent: "text-pink-400",
    cols: "lg:col-span-4",
  },
  {
    icon: ShieldCheck,
    title: "Local Insider Hacks & Safety",
    description: "Avoid tourist traps with real-world advice on local transit passes, tipping etiquette, peak hour warnings, and SIM card setups.",
    badge: "Local Knowledge",
    gradient: "from-amber-500 to-orange-400",
    accent: "text-amber-400",
    cols: "lg:col-span-6",
  },
  {
    icon: Zap,
    title: "Seamless Cloud Sync & History",
    description: "Every generated adventure is securely synced with your profile. Edit parameters, regenerate itineraries, and access on the go.",
    badge: "Always Available",
    gradient: "from-indigo-600 to-violet-600",
    accent: "text-indigo-400",
    cols: "lg:col-span-6",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-slate-950/60 border-t border-white/5">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-1/3 -right-32 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] -z-10" />
      <div className="pointer-events-none absolute bottom-10 -left-32 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>Built for Modern Explorers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered to Make Travel{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
              Effortless & Unforgettable
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Combine advanced LLM reasoning with real traveler logic to replace hours of research with instant perfection.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`${feat.cols} relative rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-slate-900/90 hover:shadow-2xl hover:-translate-y-1 group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${feat.gradient} p-0.5 shadow-md group-hover:scale-105 transition-transform`}>
                    <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
