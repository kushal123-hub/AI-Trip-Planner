import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { 
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
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Download,
  Share2,
  ExternalLink,
  Map as MapIcon,
  ListFilter
} from "lucide-react";
import { Link } from "react-router-dom";
import ItineraryMap from "./ItineraryMap";


const sampleItineraries = [
  {
    id: "sample-kyoto",
    destination: "Kyoto & Arashiyama, Japan",
    dates: "Oct 12 - Oct 16, 2026",
    budget: 75000,
    style: "Cultural & Foodie",
    overview: "An enchanting 4-day immersion into ancient imperial gardens, Michelin-starred matcha delicacies, sacred Torii gates at dawn, and serene bamboo forests.",
    days: [
      {
        day: 1,
        title: "Arashiyama Bamboo & Riverside Tranquility",
        activities: [
          "08:30 AM — Early morning walk through the towering Arashiyama Bamboo Grove before crowds arrive.",
          "11:00 AM — Explore the historic Zen gardens of Tenryu-ji World Heritage Temple.",
          "01:30 PM — Traditional handmade Soba noodle lunch along the Oi River.",
          "03:30 PM — Scenic stroll across the Togetsukyo Bridge and monkey park ascent.",
          "07:00 PM — Seasonal Kaiseki multicourse dinner in Central Kyoto."
        ]
      },
      {
        day: 2,
        title: "Torii Gate Ascent & Gion Heritage",
        activities: [
          "06:30 AM — Sunrise climb through the 10,000 Vermilion Gates of Fushimi Inari Taisha.",
          "11:00 AM — Green tea & Wagashi sweets tasting ceremony in Uji tea quarter.",
          "02:30 PM — Visit Kiyomizu-dera wooden temple with panoramic hillside views.",
          "05:30 PM — Sunset stroll along Ninenzaka & Sannenzaka preserved flagstone alleys.",
          "08:00 PM — Lantern-lit dinner in the Gion Geisha district."
        ]
      },
      {
        day: 3,
        title: "Golden Pavilion & Philosopher's Path",
        activities: [
          "09:00 AM — Marvel at Kinkaku-ji (Golden Pavilion) reflecting on mirror pond.",
          "12:00 PM — Kyoto ramen tasting near Kitano Tenmangu shrine.",
          "02:00 PM — Contemplative walk along the stone-lined Philosopher's Path.",
          "04:30 PM — Silver Pavilion (Ginkaku-ji) sand sculptures and moss garden.",
          "07:30 PM — Pontocho Alley riverside izakaya dining."
        ]
      },
      {
        day: 4,
        title: "Nijo Castle & Nishiki Food Market",
        activities: [
          "09:30 AM — Tour Nijo Castle with its famous chirping nightingale floors.",
          "12:30 PM — Street food feast at the 400-year-old Nishiki Market (tako tamago, matcha gelato).",
          "03:30 PM — Souvenir shopping for handmade ceramics and green tea crafts.",
          "06:00 PM — Farewell sunset rooftop tea overlooking Kyoto Tower."
        ]
      }
    ],
    recommended_hotels: [
      "Hoshinoya Kyoto (Luxury Riverside Ryokan)",
      "The Thousand Kyoto (Modern Eco-Design near Station)",
      "Ryokan Gion Sano (Authentic Tatami Experience)"
    ],
    recommended_restaurants: [
      "Kitcho Arashiyama (3-Star Michelin Kaiseki)",
      "Chao Chao Gyoza (Iconic Crispy Dumplings)",
      "Gion Duck Noodles (Hidden Alley Soba Bar)",
      "Ippudo Nishiki (Silky Tonkotsu Ramen)"
    ],
    budget_breakdown: {
      hotel: 32000,
      food: 18000,
      transport: 9000,
      activities: 11000,
      miscellaneous: 5000
    },
    packing_list: [
      "Comfortable slip-on walking shoes for temples",
      "Compact umbrella / UV sun parasol",
      "Universal power adapter (Type A)",
      "Modest temple-appropriate clothing",
      "Suica / IC card & small coin purse for cash-only stalls"
    ],
    travel_tips: [
      "Carry cash (Yen) as many small temple stalls and noodle shops do not take foreign cards.",
      "Get to Fushimi Inari and Arashiyama before 07:30 AM to experience total serenity without bus tours.",
      "Remember to remove shoes before stepping onto temple tatami mats."
    ]
  },
  {
    id: "sample-amalfi",
    destination: "Amalfi Coast & Capri, Italy",
    dates: "Sep 20 - Sep 24, 2026",
    budget: 120000,
    style: "Romantic & Luxury",
    overview: "A breathtaking Mediterranean coastal journey featuring cliffside pastel villas, private wooden boat tours to Capri grottos, and cliffside limoncello tastings.",
    days: [
      {
        day: 1,
        title: "Arrival in Positano & Cliffside Sunset",
        activities: [
          "11:00 AM — Check in to cliffside villa with sweeping Tyrrhenian Sea views.",
          "01:30 PM — Fresh burrata & homemade pasta lunch overlooking Spiaggia Grande.",
          "04:00 PM — Explore narrow bougainvillea-draped boutique alleyways.",
          "07:30 PM — Candlelit terrace dining at Franco's Bar for sunset Spritz."
        ]
      },
      {
        day: 2,
        title: "Private Capri Boat Excursion",
        activities: [
          "09:00 AM — Board private Gozzo boat from Positano pier to Capri.",
          "11:30 AM — Swim through emerald sea caves and marvel at Faraglioni rock formations.",
          "01:30 PM — Lunch under giant lemon groves at Da Paolino restaurant.",
          "04:00 PM — Chairlift ascent to Mount Solaro in Anacapri.",
          "07:00 PM — Cruise back during sunset golden hour."
        ]
      },
      {
        day: 3,
        title: "Ravello Gardens & Historic Amalfi Town",
        activities: [
          "10:00 AM — Visit Ravello's Villa Cimbrone and the breathtaking Infinity Terrace.",
          "01:00 PM — Wood-fired Neapolitan pizza lunch in Ravello town square.",
          "03:30 PM — Explore the 9th-century Amalfi Cathedral (Duomo di Sant'Andrea).",
          "06:00 PM — Artisanal Limoncello making workshop and tasting."
        ]
      }
    ],
    recommended_hotels: [
      "Le Sirenuse Positano (Iconic Luxury Hotel)",
      "Hotel Santa Caterina (Cliffside Elevator to Private Beach)",
      "Villa Cimbrone Ravello (Historic Botanical Palace)"
    ],
    recommended_restaurants: [
      "La Sponda (400 candlelit Michelin experience)",
      "Da Adolfo (Private beach club grilled seafood)",
      "Ristorante Marina Grande (Fresh sea bass on the sand)"
    ],
    budget_breakdown: {
      hotel: 55000,
      food: 30000,
      transport: 18000,
      activities: 12000,
      miscellaneous: 5000
    },
    packing_list: [
      "Non-slip boat deck shoes & sandals",
      "Linen shirts and lightweight evening dresses",
      "High SPF reef-safe sunscreen & sunglasses",
      "Waterproof phone pouch for sea caves"
    ],
    travel_tips: [
      "Book ferry and boat charters in advance to avoid long pier queues.",
      "SITA buses get very crowded; prefer local water taxis between Positano and Amalfi."
    ]
  }
];

const ItineraryPreviewSection = ({ activeItineraryData, onSelectDestination }) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [expandedDay, setExpandedDay] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const [showMap, setShowMap] = useState(true);

  const displayData = useMemo(() => {
    if (activeItineraryData && activeItineraryData.itinerary) {
      const trip = activeItineraryData.trip || {};
      const startDateStr = trip.start_date ? new Date(trip.start_date).toLocaleDateString() : "TBD";
      const endDateStr = trip.end_date ? new Date(trip.end_date).toLocaleDateString() : "TBD";
      return {
        ...activeItineraryData.itinerary,
        destination: trip.destination || "Custom Adventure",
        dates: `${startDateStr} to ${endDateStr}`,
        budget: parseFloat(trip.budget || 0),
        style: trip.travel_style || "Curated",
        tripId: trip.id,
      };
    }
    return sampleItineraries[selectedSampleIndex] || sampleItineraries[0];
  }, [activeItineraryData, selectedSampleIndex]);

  const breakdown = displayData.budget_breakdown || {};
  const hotelCost = parseFloat(breakdown.hotel || 0);
  const foodCost = parseFloat(breakdown.food || 0);
  const transportCost = parseFloat(breakdown.transport || 0);
  const activitiesCost = parseFloat(breakdown.activities || 0);
  const miscCost = parseFloat(breakdown.miscellaneous || 0);
  const totalAllocated = hotelCost + foodCost + transportCost + activitiesCost + miscCost;

  const toggleChecklist = (idx) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };


  return (
    <section id="itinerary-preview" className="py-24 relative overflow-hidden">
      {/* Background Accent */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>{activeItineraryData ? "Your Live AI Generated Dossier" : "Interactive Dossier Showcase"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Intelligent Itinerary</span> Experience
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            {activeItineraryData 
              ? "Here is your bespoke itinerary generated by Gemini AI! View the breakdown, day-by-day roadmap, stays, and packing list."
              : "Experience how our AI structures multi-day travel with paced activities, verified hotels, dining, and smart financial breakdown."}
          </p>
        </div>

        {/* If showing sample, provide switcher tabs and map toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {!activeItineraryData ? (
            <div className="inline-flex rounded-2xl border border-white/10 bg-slate-900/80 p-1.5 backdrop-blur-xl">
              {sampleItineraries.map((sample, idx) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedSampleIndex(idx);
                    setExpandedDay(1);
                    setCheckedItems({});
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    selectedSampleIndex === idx
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {sample.destination.split(",")[0]}
                </button>
              ))}
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={() => setShowMap(!showMap)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              showMap
                ? "bg-violet-600/20 border-violet-500/40 text-violet-300 shadow-md shadow-violet-600/20"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <MapIcon className="h-4 w-4 text-violet-400" />
            <span>{showMap ? "Hide Interactive Route Map" : "Show Interactive Route Map"}</span>
          </button>
        </div>

        {/* Embedded Interactive Route Map */}
        {showMap && (
          <div className="mb-8">
            <ItineraryMap
              itinerary={displayData}
              destination={displayData.destination}
            />
          </div>
        )}

        {/* Main Dossier Card */}
        <div className="rounded-3xl border border-white/15 bg-slate-900/80 shadow-2xl backdrop-blur-2xl overflow-hidden">

          
          {/* Trip Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-violet-950/80 via-slate-900 to-slate-950 border-b border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                    {displayData.style}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-cyan-400" />
                    {displayData.dates}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {displayData.destination}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {displayData.trip_overview || displayData.overview}
                </p>
              </div>

              {/* Total Budget Pill */}
              <div className="flex flex-col md:items-end justify-center rounded-2xl bg-white/5 border border-white/10 p-4 sm:px-6">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Max Budget</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  ₹{displayData.budget?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Dossier Body: 2 Columns */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col (8 cols): Day-by-Day Schedule */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="h-5 w-5 text-violet-400" />
                  <span>Day-by-Day Itinerary Roadmap</span>
                </h4>
                <span className="text-xs text-slate-400 font-medium">
                  {displayData.days?.length} Days Planned
                </span>
              </div>

              {/* Day Accordion */}
              <div className="space-y-3">
                {displayData.days?.map((day) => {
                  const isExpanded = expandedDay === day.day;
                  return (
                    <div
                      key={day.day}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
                            D{day.day}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-violet-400">Day {day.day}</span>
                            <h5 className="text-sm font-bold text-white">{day.title}</h5>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-5 pb-5 pt-1 border-t border-white/5 space-y-2.5"
                          >
                            {day.activities?.map((activity, aIdx) => (
                              <div key={aIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                                <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{activity}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Local Travel Tips */}
              {displayData.travel_tips && displayData.travel_tips.length > 0 && (
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                  <h5 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider mb-3">
                    <Info className="h-4 w-4 text-cyan-400" />
                    <span>Insider Local Travel Advice</span>
                  </h5>
                  <div className="space-y-2">
                    {displayData.travel_tips.map((tip, tIdx) => (
                      <p key={tIdx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col (4 cols): Budget Breakdown, Hotels, Dining & Packing */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Budget Breakdown Card */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-emerald-400" />
                    <span>Estimated Budget Breakdown</span>
                  </h4>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Accommodation", value: hotelCost, color: "bg-violet-500", text: "text-violet-400" },
                    { label: "Food & Gastronomy", value: foodCost, color: "bg-cyan-400", text: "text-cyan-400" },
                    { label: "Transportation", value: transportCost, color: "bg-amber-400", text: "text-amber-400" },
                    { label: "Activities & Sightseeing", value: activitiesCost, color: "bg-emerald-400", text: "text-emerald-400" },
                    { label: "Miscellaneous", value: miscCost, color: "bg-pink-400", text: "text-pink-400" },
                  ].map((item) => {
                    const percentage = totalAllocated > 0 ? (item.value / totalAllocated) * 100 : 0;
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
                  <span className="text-slate-400 font-semibold">Total Projected Cost:</span>
                  <span className="font-bold text-sm text-emerald-400">
                    ₹{totalAllocated.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Recommended Hotels & Restaurants */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-violet-400 flex items-center gap-1.5 uppercase tracking-wider mb-2.5">
                    <Hotel className="h-4 w-4" />
                    <span>Curated Stays</span>
                  </h5>
                  <div className="space-y-1.5">
                    {displayData.recommended_hotels?.map((hotel, hIdx) => (
                      <div key={hIdx} className="text-xs text-slate-300 flex items-start gap-2 bg-white/5 p-2 rounded-xl">
                        <CheckCircle2 className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{hotel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider mb-2.5">
                    <Utensils className="h-4 w-4" />
                    <span>Must-Try Dining</span>
                  </h5>
                  <div className="space-y-1.5">
                    {displayData.recommended_restaurants?.map((rest, rIdx) => (
                      <div key={rIdx} className="text-xs text-slate-300 flex items-start gap-2 bg-white/5 p-2 rounded-xl">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{rest}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Packing Checklist */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-3">
                <h5 className="text-xs font-bold text-pink-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckSquare className="h-4 w-4" />
                  <span>Packing Checklist ({Object.values(checkedItems).filter(Boolean).length}/{displayData.packing_list?.length || 0})</span>
                </h5>
                <div className="space-y-1.5">
                  {displayData.packing_list?.map((item, pIdx) => {
                    const isChecked = !!checkedItems[pIdx];
                    return (
                      <button
                        key={pIdx}
                        onClick={() => toggleChecklist(pIdx)}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-start gap-2 transition cursor-pointer ${
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

              {/* Link to dedicated itinerary page if active */}
              {activeItineraryData && (
                <Link
                  to={`/itinerary/${activeItineraryData.trip.id}`}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition"
                >
                  <span>Open Full Screen Dossier</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ItineraryPreviewSection;
