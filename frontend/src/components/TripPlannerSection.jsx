import React, { useState, useEffect } from "react";
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
  Compass as AdventureIcon,
  PiggyBank
} from "lucide-react";
import confetti from "canvas-confetti";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import AIGenerationLoader from "./AIGenerationLoader";

const travelStyleOptions = [
  { label: "Cultural & Heritage", value: "Cultural", icon: Compass, desc: "Temples, museums, local folklore" },
  { label: "Adventure & Thrill", value: "Adventure", icon: Mountain, desc: "Treks, hikes, outdoor excursions" },
  { label: "Relaxation & Spa", value: "Relaxing", icon: Palmtree, desc: "Beaches, resorts, wellness" },
  { label: "Romantic Getaway", value: "Romantic", icon: Heart, desc: "Intimate dining, scenic views" },
  { label: "Gastronomic & Foodie", value: "Foodie", icon: Utensils, desc: "Street food, fine dining, wine" },
  { label: "Luxury & Exclusive", value: "Luxury", icon: Crown, desc: "5-star stays, private tours" },
  { label: "Family Friendly", value: "Family", icon: Users, desc: "Fun for all ages, parks, safety" },
  { label: "Budget & Backpacking", value: "Budget", icon: PiggyBank, desc: "Hostels, smart transit, value" },
];

const popularInterests = [
  "Local Street Food", "Ancient Temples", "Scenic Photography", "Mountain Hiking",
  "Sunset Cruises", "Art & Architecture", "Beach Relaxation", "Night Markets",
  "Wildlife Safaris", "Hidden Cafes", "Wine Tasting", "Water Sports", "Local Festivals"
];

const budgetPresets = [
  { label: "₹25,000", value: 25000 },
  { label: "₹50,000", value: 50000 },
  { label: "₹1,00,000", value: 100000 },
  { label: "₹2,00,000", value: 200000 },
];

const popularDestinations = ["Kyoto, Japan", "Amalfi Coast, Italy", "Bali, Indonesia", "Swiss Alps", "Goa, India", "Paris, France"];

const TripPlannerSection = ({ preloadedData, onItineraryGenerated }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("50000");
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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"],
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
      // Prompt modal without losing inputs
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
      <div className="pointer-events-none absolute top-10 right-10 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>Interactive AI Generator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Custom Itinerary</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Tell us your destination, dates, and budget. Our Gemini engine builds a complete trip in seconds.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="rounded-3xl border border-white/15 bg-slate-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative">
          
          {/* Step Indicator Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-10" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-cyan-400 -translate-y-1/2 -z-10 transition-all duration-300"
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
                      onClick={() => {
                        if (s.num < currentStep) setCurrentStep(s.num);
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold transition-all duration-200 ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                          : isCurrent
                          ? "bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30 scale-110"
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
                    className="w-full rounded-2xl border border-white/10 bg-slate-800/60 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:bg-slate-800 focus:ring-2 focus:ring-violet-500/20"
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
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition"
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
                      className="w-full rounded-2xl border border-white/10 bg-slate-800/60 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-500 focus:bg-slate-800"
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
                      className="w-full rounded-2xl border border-white/10 bg-slate-800/60 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-500 focus:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
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
                  <span className="text-xs font-bold text-emerald-400">
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
                    placeholder="50000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-800/60 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:bg-slate-800"
                  />
                </div>

                {/* Quick Budget Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {budgetPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setBudget(preset.value.toString())}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition border ${
                        budget === preset.value.toString()
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {preset.label}
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
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-b from-violet-600/30 to-purple-600/20 border-violet-500 shadow-lg shadow-violet-500/20 scale-[1.02]"
                            : "bg-slate-800/40 border-white/5 hover:border-white/15 hover:bg-slate-800/70"
                        }`}
                      >
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center mb-2 ${
                          isSelected ? "bg-violet-600 text-white" : "bg-white/10 text-slate-300"
                        }`}>
                          <StyleIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{style.value}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{style.desc}</p>
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
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  What activities excite you most? (Select multiple)
                </label>
                <p className="text-xs text-slate-400 mb-4">
                  Our AI uses your chosen interests to tailor daytime excursions, dining recommendations, and hidden neighborhood gems.
                </p>

                {/* Popular Interest Pills */}
                <div className="flex flex-wrap gap-2">
                  {popularInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/25"
                            : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{interest}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Interest */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Add specific places or niche hobbies:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Scuba diving, Anime shops, Matcha tasting..."
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomInterest(e);
                      }
                    }}
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={addCustomInterest}
                    className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Summary Overview Card */}
              <div className="p-4 rounded-2xl border border-white/10 bg-slate-950/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-semibold text-white">{destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dates:</span>
                  <span className="font-semibold text-white">{startDate} to {endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Budget:</span>
                  <span className="font-semibold text-emerald-400">₹{parseFloat(budget || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Style:</span>
                  <span className="font-semibold text-violet-400">{travelStyle}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation & Action Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] transition"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-sm font-bold text-white shadow-xl shadow-violet-600/40 hover:shadow-violet-600/60 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                <span>Generate AI Itinerary</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TripPlannerSection;
