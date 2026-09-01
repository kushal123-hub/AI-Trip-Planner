import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Wallet, 
  ArrowLeft, 
  ArrowRight, 
  Palmtree, 
  Mountain, 
  Heart, 
  Utensils, 
  Crown, 
  Users, 
  PiggyBank, 
  Check, 
  AlertCircle 
} from "lucide-react";
import API from "../api/api";

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
  "Wildlife Safaris", "Hidden Cafes", "Wine Tasting", "Water Sports"
];

const budgetPresets = [
  { label: "₹25,000", value: 25000 },
  { label: "₹50,000", value: 50000 },
  { label: "₹1,00,000", value: 100000 },
  { label: "₹2,00,000", value: 200000 },
];

const CreateTrip = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("50000");
  const [travelStyle, setTravelStyle] = useState("Cultural");
  const [selectedInterests, setSelectedInterests] = useState(["Local Street Food", "Scenic Photography"]);
  const [customInterest, setCustomInterest] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!destination.trim()) {
      setError("Please specify a destination.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setError("Departure date cannot be in the past.");
      return;
    }

    if (end < start) {
      setError("Return date must be on or after the departure date.");
      return;
    }

    if (parseFloat(budget) <= 0) {
      setError("Budget must be a positive number.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/trip/create", {
        destination: destination.trim(),
        start_date: startDate,
        end_date: endDate,
        budget: parseFloat(budget),
        interests: selectedInterests.join(", ") || null,
        travel_style: travelStyle || null,
      });

      const tripId = response.data.id;
      navigate(`/itinerary/${tripId}`);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to create trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#08D9D6] mb-6 transition cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Dashboard</span>
      </button>

      <div className="rounded-3xl border border-white/15 bg-[#252A34]/85 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#08D9D6]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#FF2E63]/15 blur-3xl" />

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#08D9D6]/30 bg-[#08D9D6]/10 text-[#08D9D6] text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#08D9D6]" />
            <span>AI Itinerary Architect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#EAEAEA] tracking-tight">
            Plan Your Next Destination
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Provide your travel preferences, and our artificial intelligence will build a customized, premium day-by-day itinerary complete with stays, cuisine, and financial pacing.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Destination */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Where do you want to go?
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#08D9D6]" />
              <input
                type="text"
                required
                placeholder="e.g. Paris, Kyoto, Goa, Swiss Alps..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#181b22]/70 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#08D9D6] focus:bg-[#181b22]"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#181b22]/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#08D9D6] focus:bg-[#181b22]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#181b22]/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#08D9D6] focus:bg-[#181b22]"
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Total Budget (INR)
              </label>
              <span className="text-xs font-bold text-[#08D9D6]">
                ₹{parseFloat(budget || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="relative mb-3">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#08D9D6]" />
              <input
                type="number"
                min="1000"
                step="1000"
                required
                placeholder="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#181b22]/70 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#08D9D6] focus:bg-[#181b22]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {budgetPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setBudget(preset.value.toString())}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                    budget === preset.value.toString()
                      ? "bg-[#08D9D6]/20 border-[#08D9D6] text-[#08D9D6]"
                      : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Travel Style & Atmosphere
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
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#08D9D6]/15 border-[#08D9D6] shadow-lg shadow-[#08D9D6]/20 scale-[1.02]"
                        : "bg-[#181b22]/50 border-white/5 hover:border-white/15 hover:bg-[#181b22]/80"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center mb-2 ${
                      isSelected ? "bg-[#08D9D6] text-[#252A34]" : "bg-white/10 text-slate-300"
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

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Interests & Focus Areas
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {popularInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-[#FF2E63] to-[#ff5782] text-white border-[#FF2E63] shadow-md shadow-[#FF2E63]/25"
                        : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom interest (e.g. Scuba diving, Anime shops)..."
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomInterest(e);
                  }
                }}
                className="flex-1 rounded-2xl border border-white/10 bg-[#181b22]/70 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-[#08D9D6] focus:bg-[#181b22]"
              />
              <button
                type="button"
                onClick={addCustomInterest}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-[#08D9D6]/20 hover:text-[#08D9D6] text-xs font-semibold text-white border border-white/10 transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E63] via-[#ff4777] to-[#FF2E63] text-white font-bold text-sm shadow-xl shadow-[#FF2E63]/40 hover:shadow-[#FF2E63]/60 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Build AI Itinerary</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTrip;