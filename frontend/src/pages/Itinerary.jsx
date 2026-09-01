import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Wallet, 
  Hotel, 
  Utensils, 
  CheckCircle2, 
  Info, 
  CheckSquare, 
  Square, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Printer,
  Share2,
  AlertCircle,
  Tag,
  Clock
} from "lucide-react";
import confetti from "canvas-confetti";
import API from "../api/api";
import AIGenerationLoader from "../components/AIGenerationLoader";

const Itinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [expandedDay, setExpandedDay] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await API.get(`/trip/${id}`);
        setTrip(response.data);

        if (response.data.ai_itinerary) {
          try {
            const parsed = typeof response.data.ai_itinerary === "string"
              ? JSON.parse(response.data.ai_itinerary)
              : response.data.ai_itinerary;
            setItinerary(parsed);
          } catch (e) {
            console.error("Error parsing itinerary JSON", e);
            setError("Failed to parse cached itinerary. You can regenerate below.");
          }
        }
      } catch (err) {
        setError("Failed to load trip details. It may not exist or you might lack permission.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const generateItinerary = async () => {
    if (!trip) return;
    setError("");
    setGenerating(true);

    try {
      const response = await API.post("/ai/generate", {
        trip_id: trip.id,
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        budget: parseFloat(trip.budget),
        interests: trip.interests || "Sightseeing, food, local culture",
        travel_style: trip.travel_style || "General",
      });

      setItinerary(response.data.itinerary);
      
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
    } catch (err) {
      setError(
        err.response?.data?.detail || "AI itinerary generation encountered an issue. Please try again."
      );
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleTogglePacking = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-violet-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Loading your itinerary dossier...</p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center">
        <AIGenerationLoader destination={trip?.destination} budget={trip?.budget} />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 max-w-2xl mx-auto flex items-center justify-center">
        <div className="w-full rounded-3xl border border-white/15 bg-slate-900/80 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-2xl">
          <div className="h-16 w-16 rounded-3xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center mx-auto mb-4">
            <Compass className="h-8 w-8 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No AI Itinerary Generated Yet</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            We have your trip parameters saved for <strong className="text-white">{trip?.destination}</strong> with budget of <strong className="text-emerald-400">₹{parseFloat(trip?.budget || 0).toLocaleString("en-IN")}</strong>. Ready to craft your day-by-day roadmap?
          </p>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={generateItinerary}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-105 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate AI Itinerary</span>
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Budget calculations
  const totalBudgetVal = parseFloat(trip.budget);
  const breakdown = itinerary.budget_breakdown || {};
  const hotelCost = parseFloat(breakdown.hotel || 0);
  const foodCost = parseFloat(breakdown.food || 0);
  const transportCost = parseFloat(breakdown.transport || 0);
  const activitiesCost = parseFloat(breakdown.activities || 0);
  const miscCost = parseFloat(breakdown.miscellaneous || 0);
  const totalCalculated = hotelCost + foodCost + transportCost + activitiesCost + miscCost;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={generateItinerary}
            className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCw className="h-3.5 w-3.5 text-violet-400" />
            <span>Regenerate</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-cyan-400" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Trip Banner */}
      <div className="relative rounded-3xl border border-white/15 bg-gradient-to-r from-violet-950/90 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden mb-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                {trip.travel_style || "Curated"}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                <span>{new Date(trip.start_date).toLocaleDateString()} to {new Date(trip.end_date).toLocaleDateString()}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {trip.destination}
            </h1>

            {trip.interests && (
              <p className="mt-2 text-xs text-slate-400 max-w-xl">
                <span className="text-slate-500 font-semibold">Focus Interests:</span> {trip.interests}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-left md:text-right min-w-[200px]">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Maximum Budget</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block mt-0.5">
              ₹{totalBudgetVal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Overview & Daily Timeline */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Trip Overview Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Compass className="h-4 w-4 text-violet-400" />
              <span>Trip Overview & Atmosphere</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {itinerary.trip_overview}
            </p>
          </div>

          {/* Day-by-Day Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-400" />
                <span>Day-by-Day Schedule Roadmap</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {itinerary.days?.length} Days Total
              </span>
            </div>

            <div className="space-y-3">
              {itinerary.days?.map((day) => {
                const isExpanded = expandedDay === day.day;
                return (
                  <div
                    key={day.day}
                    className="rounded-3xl border border-white/10 bg-slate-900/60 overflow-hidden backdrop-blur-xl transition-all"
                  >
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
                          D{day.day}
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">Day {day.day}</span>
                          <h4 className="text-sm sm:text-base font-bold text-white">{day.title}</h4>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-3 animate-in fade-in duration-200">
                        {day.activities?.map((activity, aIdx) => (
                          <div key={aIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{activity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Local Travel Tips Alert */}
          {itinerary.travel_tips && itinerary.travel_tips.length > 0 && (
            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6 backdrop-blur-xl">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2 uppercase tracking-wider mb-3">
                <Info className="h-4 w-4 text-cyan-400" />
                <span>Local Travel Tips & Practical Advice</span>
              </h4>
              <div className="space-y-2">
                {itinerary.travel_tips.map((tip, tIdx) => (
                  <p key={tIdx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{tip}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (4 cols): Budget, Stays, Gastronomy & Packing */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Budget Breakdown */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Wallet className="h-4 w-4 text-emerald-400" />
              <span>Projected Budget Allocation</span>
            </h4>

            <div className="space-y-3">
              {[
                { label: "Accommodation", value: hotelCost, color: "bg-violet-500" },
                { label: "Food & Dining", value: foodCost, color: "bg-cyan-400" },
                { label: "Transportation", value: transportCost, color: "bg-amber-400" },
                { label: "Activities & Entry", value: activitiesCost, color: "bg-emerald-400" },
                { label: "Miscellaneous", value: miscCost, color: "bg-pink-400" },
              ].map((item) => {
                const percentage = totalCalculated > 0 ? (item.value / totalCalculated) * 100 : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-semibold text-white">₹{item.value.toLocaleString("en-IN")} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Total Estimated Cost:</span>
              <span className={`font-bold text-sm ${totalCalculated > totalBudgetVal ? "text-amber-400" : "text-emerald-400"}`}>
                ₹{totalCalculated.toLocaleString("en-IN")}
              </span>
            </div>

            {totalCalculated > totalBudgetVal && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                ⚠️ Estimated costs slightly exceed your target budget cap.
              </div>
            )}
          </div>

          {/* Stays & Dining */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg space-y-5">
            <div>
              <h5 className="text-xs font-bold text-violet-400 flex items-center gap-1.5 uppercase tracking-wider mb-3">
                <Hotel className="h-4 w-4" />
                <span>Recommended Accommodations</span>
              </h5>
              <div className="space-y-2">
                {itinerary.recommended_hotels?.map((hotel, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-white/5 p-2.5 rounded-2xl">
                    <CheckCircle2 className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{hotel}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider mb-3">
                <Utensils className="h-4 w-4" />
                <span>Recommended Gastronomy</span>
              </h5>
              <div className="space-y-2">
                {itinerary.recommended_restaurants?.map((rest, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-white/5 p-2.5 rounded-2xl">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{rest}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Packing Checklist */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg space-y-3">
            <h5 className="text-xs font-bold text-pink-400 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckSquare className="h-4 w-4" />
              <span>Packing Checklist ({Object.values(checkedItems).filter(Boolean).length}/{itinerary.packing_list?.length || 0})</span>
            </h5>
            <div className="space-y-2">
              {itinerary.packing_list?.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => handleTogglePacking(idx)}
                    className={`w-full text-left p-2.5 rounded-2xl text-xs flex items-start gap-2 transition cursor-pointer ${
                      isChecked ? "bg-emerald-500/10 text-slate-400 line-through" : "bg-white/5 text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Itinerary;