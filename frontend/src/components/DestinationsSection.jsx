import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, Clock, Wallet, ArrowUpRight, Compass, Star } from "lucide-react";

const destinationsData = [
  {
    id: 1,
    name: "Kyoto",
    country: "Japan",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    duration: "4 - 6 Days",
    estimatedBudget: 75000,
    style: "Cultural",
    interests: "Historic temples, matcha tea ceremonies, bamboo groves, Kaiseki dining",
    rating: 4.95,
    tag: "Top Cultural Pick",
  },
  {
    id: 2,
    name: "Amalfi Coast",
    country: "Italy",
    category: "Romantic",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    duration: "5 - 7 Days",
    estimatedBudget: 120000,
    style: "Luxury",
    interests: "Cliffside vistas, limoncello tasting, Mediterranean boat tours, fine dining",
    rating: 4.98,
    tag: "Romantic Getaway",
  },
  {
    id: 3,
    name: "Bali",
    country: "Indonesia",
    category: "Tropical",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    duration: "5 - 8 Days",
    estimatedBudget: 45000,
    style: "Relaxing",
    interests: "Ubud rice terraces, beach clubs, yoga retreats, sunset surfing in Canggu",
    rating: 4.88,
    tag: "Tropical Paradise",
  },
  {
    id: 4,
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    duration: "5 - 7 Days",
    estimatedBudget: 140000,
    style: "Adventure",
    interests: "Glacier express, alpine hiking, fondue tasting, Matterhorn panorama",
    rating: 4.97,
    tag: "Peak Adventure",
  },
  {
    id: 5,
    name: "Jaipur & Udaipur",
    country: "India",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    duration: "4 - 5 Days",
    estimatedBudget: 35000,
    style: "Cultural",
    interests: "Heritage palaces, lake boat rides, Rajasthani thali, royal fort treks",
    rating: 4.91,
    tag: "Royal Heritage",
  },
  {
    id: 6,
    name: "Cappadocia",
    country: "Turkey",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80",
    duration: "3 - 5 Days",
    estimatedBudget: 60000,
    style: "Adventure",
    interests: "Hot air balloon sunrise, cave hotel stays, underground cities, valley quad biking",
    rating: 4.93,
    tag: "Unique Wonder",
  },
  {
    id: 7,
    name: "Santorini",
    country: "Greece",
    category: "Romantic",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    duration: "4 - 6 Days",
    estimatedBudget: 95000,
    style: "Romantic",
    interests: "Oia sunset watching, caldera wine tasting, white-washed village walks, catamaran cruise",
    rating: 4.96,
    tag: "Sunset Capital",
  },
  {
    id: 8,
    name: "Goa",
    country: "India",
    category: "Budget",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    duration: "3 - 5 Days",
    estimatedBudget: 25000,
    style: "Relaxing",
    interests: "Beach shacks, Portuguese architecture in Fontainhas, sunset boat cruises, seafood",
    rating: 4.82,
    tag: "Coastal Chill",
  },
];

const categories = ["All", "Cultural", "Adventure", "Tropical", "Romantic", "Budget"];

const DestinationsSection = ({ onSelectDestination }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDestinations = selectedCategory === "All" 
    ? destinationsData 
    : destinationsData.filter(d => d.category === selectedCategory);

  return (
    <section id="destinations" className="py-24 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="pointer-events-none absolute top-1/2 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold backdrop-blur-md mb-3">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>Curated Inspiration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Dream Destinations</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl">
              Tap any hotspot to pre-load our AI Planner with tailored itineraries, curated stays, and optimal budget models.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-105"
                    : "bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredDestinations.map((dest) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={dest.id}
                className="group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-600/20 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/60 text-white border border-white/20 backdrop-blur-md">
                      {dest.tag}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 border border-white/15 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{dest.rating}</span>
                  </div>

                  {/* Destination Title on Image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-violet-400" />
                      {dest.country}
                    </p>
                  </div>
                </div>

                {/* Content & Specs */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        {dest.duration}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Wallet className="h-3.5 w-3.5" />
                        ₹{dest.estimatedBudget.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {dest.interests}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onSelectDestination(dest)}
                    className="w-full py-2.5 rounded-xl border border-violet-500/30 bg-violet-600/10 hover:bg-violet-600 text-violet-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md group-hover:bg-violet-600 group-hover:text-white cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Plan with AI</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default DestinationsSection;
