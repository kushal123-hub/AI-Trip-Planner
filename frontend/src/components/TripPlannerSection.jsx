import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Wallet, 
  Tag, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  Palmtree,
  Mountain,
  Heart,
  Utensils,
  Crown,
  Users,
  PiggyBank,
  Clock,
  Plus
} from "lucide-react";
import confetti from "canvas-confetti";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import AIGenerationLoader from "./AIGenerationLoader";

const travelStyleOptions = [
  { label: "Cultural & Heritage", value: "Cultural", icon: Compass, desc: "Temples, museums, traditions", gradient: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30" },
  { label: "Adventure & Thrill", value: "Adventure", icon: Mountain, desc: "Treks, trails, outdoor thrill", gradient: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/30" },
  { label: "Relaxation & Spa", value: "Relaxing", icon: Palmtree, desc: "Beaches, resorts & wellness", gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30" },
  { label: "Romantic Escape", value: "Romantic", icon: Heart, desc: "Intimate views & fine wine", gradient: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30" },
  { label: "Gastronomic Foodie", value: "Foodie", icon: Utensils, desc: "Street stalls, Michelin stars", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30" },
  { label: "Luxury & VIP", value: "Luxury", icon: Crown, desc: "5-star retreats & chauffeur", gradient: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/30" },
  { label: "Family Friendly", value: "Family", icon: Users, desc: "Safe, engaging & paced", gradient: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" },
  { label: "Smart Budget", value: "Budget", icon: PiggyBank, desc: "Hostels & authentic value", gradient: "from-teal-500/20 to-emerald-500/20", border: "border-teal-500/30" },
];

const popularInterests = [
  "Local Street Food", "Ancient Temples", "Scenic Photography", "Mountain Hiking",
  "Sunset Cruises", "Art & Architecture", "Beach Relaxation", "Night Markets",
  "Wildlife Safaris", "Hidden Cafes", "Wine Tasting", "Water Sports", "Local Festivals"
];

const budgetPresets = [
  { label: "₹30,000", value: 30000, tag: "Smart Budget" },
  { label: "₹65,000", value: 65000, tag: "Popular Pick" },
  { label: "₹1,25,000", value: 125000, tag: "Premium" },
  { label: "₹2,50,000+", value: 250000, tag: "Luxury Tier" },
];

const popularDestinations = ["Kyoto, Japan", "Amalfi Coast, Italy", "Bali, Indonesia", "Swiss Alps", "Goa, India", "Paris, France"];

const TripPlannerSection = ({ preloadedData, onItineraryGenerated }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("65000");
  const [travelStyle, setTravelStyle] = useState("Cultural");
  const [selectedInterests, setSelectedInterests] = useState(["Local Street Food", "Scenic Photography"]);
  const [customInterest, setCustomInterest] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Default dates to next week
  useEffect(() => {
    if (!startDate && !endDate) {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const returnDate = new Date(nextWeek);
      returnDate.setDate(nextWeek.getDate() + 4);

      setStartDate(nextWeek.toISOString().split("T")[0]);
      setEndDate(returnDate.toISOString().split("T")[0]);
    }
  }, [startDate, endDate]);

  // Handle preloaded data from destinations section
  useEffect(() => {
    if (preloadedData) {
      if (preloadedData.name) {
        setDestination(`${preloadedData.name}, ${preloadedData.country || ""}`.trim());
      }
      if (preloadedData.style) setTravelStyle(preloadedData.style);
      if (preloadedData.estimatedBudget) setBudget(preloadedData.estimatedBudget.toString());
      if (preloadedData.interests) {
        const parsed = preloadedData.interests.split(",").map(s => s.trim());
        setSelectedInterests(parsed);
      }
      setCurrentStep(1);
    }
  }, [preloadedData]);

  // Calculate days duration
  const tripDurationDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate) - new Date(startDate);
    const days = Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 0;
  }, [startDate, endDate]);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const addCustomInterest = (e) => {
    e.preventDefault();
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const validateStep1 = () => {
    if (!destination.trim()) {
      setError("Please specify a travel destination.");
      return false;
    }
    if (!startDate || !endDate) {
      setError("Please pick both start and end dates.");
      return false;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setError("Return date cannot be before departure date.");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!budget || parseFloat(budget) <= 0) {
      setError("Please enter a valid budget above 0.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const executeGeneration = async () => {
    setError("");
    setLoading(true);

    try {
      // 1. Create Trip record in backend
      const tripResponse = await API.post("/trip/create", {
        destination: destination.trim(),
        start_date: startDate,
        end_date: endDate,
        budget: parseFloat(budget),
        interests: selectedInterests.join(", ") || "Sightseeing, food, local culture",
        travel_style: travelStyle || "General",
      });

      const newTrip = tripResponse.data;

      // 2. Trigger Gemini AI generation
      const aiResponse = await API.post("/ai/generate", {
        trip_id: newTrip.id,
        destination: destination.trim(),
        start_date: startDate,
        end_date: endDate,
        budget: parseFloat(budget),
        interests: selectedInterests.join(", ") || "Sightseeing, food, local culture",
        travel_style: travelStyle || "General",
      });

      // Celebration confetti!
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ec4899"],
        });
      } catch (e) {
        // ignore
      }

      if (onItineraryGenerated) {
        onItineraryGenerated({
          trip: newTrip,
          itinerary: aiResponse.data.itinerary,
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "AI itinerary generation encountered an issue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    if (!isAuthenticated) {
      openAuthModal("register", () => {
        executeGeneration();
      });
      return;
    }

    executeGeneration();
  };

  if (loading) {
    return (
      <section id="planner" className="py-20 relative">
        <AIGenerationLoader destination={destination} budget={budget} />
      </section>
    );
  }

  return (
    <section id="planner" className="py-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute top-10 right-10 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] -z-10 animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] -z-10 animate-float-slow" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold backdrop-blur-md mb-3 shadow-sm shadow-violet-500/20">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>Interactive AI Generator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400">Custom Itinerary</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Tell us your destination, dates, and budget. Our intelligent travel engine builds a complete trip in seconds.
          </p>

        </div>

        {/* Wizard Card Container */}
        <div className="rounded-3xl border border-white/15 bg-slate-900/85 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative">
          
          {/* Step Indicator Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-10" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 -translate-y-1/2 -z-10 transition-all duration-300 shadow-sm shadow-violet-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />

              {[
                { num: 1, label: "Destination & Dates" },
                { num: 2, label: "Budget & Style" },
                { num: 3, label: "Vibes & Interests" },
              ].map((s) => {
                const isCompleted = currentStep > s.num;
                const isCurrent = currentStep === s.num;

                return (
                  <div key={s.num} className="flex flex-col items-center gap-1.5 bg-slate-900 px-2 sm:px-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (s.num < currentStep) setCurrentStep(s.num);
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                          : isCurrent
                          ? "bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/40 scale-110 ring-2 ring-violet-400/50"
                          : "border border-white/10 bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : s.num}
                    </button>
                    <span className={`text-[11px] font-semibold hidden sm:block ${isCurrent ? "text-white" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Step 1: Destination & Dates */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Where would you like to travel?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-800/70 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:bg-slate-800 focus:ring-2 focus:ring-violet-500/25"
                  />
                </div>

                {/* Popular destination quick chips */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Trending:</span>
                  {popularDestinations.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setDestination(city)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition cursor-pointer"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Departure Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-800/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-500 focus:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-800/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-500 focus:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Duration Live Calculation Pill */}
              {tripDurationDays > 0 && (
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 flex items-center justify-between text-xs text-cyan-300">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span>Calculated Length:</span>
                  </span>
                  <span className="font-bold text-white bg-cyan-500/20 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                    {tripDurationDays} Days / {Math.max(tripDurationDays - 1, 1)} Nights
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Budget & Travel Style */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Budget Input & Presets */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Total Trip Budget (INR)
                  </label>
                  <span className="text-sm font-extrabold text-emerald-400">
                    ₹{parseFloat(budget || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="relative mb-3">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    placeholder="65000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-800/70 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:bg-slate-800"
                  />
                </div>

                {/* Quick Budget Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {budgetPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setBudget(preset.value.toString())}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                        budget === preset.value.toString()
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20"
                          : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="block font-bold">{preset.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{preset.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Select Travel Style & Vibe
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {travelStyleOptions.map((style) => {
                    const StyleIcon = style.icon;
                    const isSelected = travelStyle === style.value;

                    return (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => setTravelStyle(style.value)}
                        className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? `bg-gradient-to-br ${style.gradient} border-violet-500 shadow-lg shadow-violet-500/20 scale-[1.03]`
                            : "border-white/10 bg-slate-800/40 hover:bg-slate-800/80 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-xl ${isSelected ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400"}`}>
                            <StyleIcon className="h-4 w-4" />
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-violet-400" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{style.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{style.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Interests & Vibes */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  What activities excite you most? ({selectedInterests.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 scale-105 border border-violet-400/40"
                            : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/15"
                        }`}
                      >
                        {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 text-slate-500" />}
                        <span>{interest}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom interest adder */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Add custom preference / dietary requirements:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian ramen, rooftop bars, kid-friendly..."
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addCustomInterest(e);
                    }}
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-800/70 py-3 px-4 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomInterest}
                    className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Review Snapshot */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-bold text-white">{destination || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dates:</span>
                  <span className="text-slate-200">{startDate} to {endDate} ({tripDurationDays} Days)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Budget:</span>
                  <span className="font-bold text-emerald-400">₹{parseFloat(budget || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Style:</span>
                  <span className="text-violet-300 font-semibold">{travelStyle}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-violet-600/40 hover:shadow-violet-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer animate-shimmer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Itinerary with AI</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default TripPlannerSection;
