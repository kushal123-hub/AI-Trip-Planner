import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Compass, 
  Search, 
  MapPin, 
  Calendar, 
  Wallet, 
  Eye, 
  Trash2, 
  PlusCircle, 
  ArrowLeft,
  Tag,
  AlertCircle,
  Clock
} from "lucide-react";
import API from "../api/api";

const TripHistory = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStyle, setFilterStyle] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalId, setDeleteModalId] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await API.get("/trip/history");
        setTrips(response.data);
      } catch (err) {
        setError("Failed to fetch your trip history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      await API.delete(`/trip/${deleteModalId}`);
      setTrips(trips.filter((t) => t.id !== deleteModalId));
      setDeleteModalId(null);
    } catch (err) {
      alert("Failed to delete trip.");
      console.error(err);
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = filterStyle === "All" || trip.travel_style === filterStyle;
    return matchesSearch && matchesStyle;
  });

  const availableStyles = ["All", ...new Set(trips.map((t) => t.travel_style).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-violet-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Loading saved journeys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Navigation Top */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <Link
          to="/create-trip"
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-violet-600/30 flex items-center gap-1.5 transition hover:scale-105"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Your Planned Journeys
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Browse, inspect, and manage your AI-engineered itineraries and travel dossiers.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500"
          />
        </div>

        {availableStyles.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {availableStyles.map((style) => (
              <button
                key={style}
                onClick={() => setFilterStyle(style)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filterStyle === style
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "bg-slate-900/60 text-slate-400 border border-white/5 hover:text-white"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/40 p-12 text-center">
          <Compass className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No trips found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            {searchQuery
              ? `No destinations matching "${searchQuery}".`
              : "You have not generated any custom travel plans yet."}
          </p>
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Trip</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-violet-500/40 transition-all duration-200 group shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 border border-violet-500/20 text-violet-300">
                    {trip.travel_style || "Curated"}
                  </span>
                  {trip.ai_itinerary ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      AI Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      Draft
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                    {trip.destination}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3.5 text-xs flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                    Budget:
                  </span>
                  <span className="font-bold text-emerald-400">
                    ₹{parseFloat(trip.budget).toLocaleString("en-IN")}
                  </span>
                </div>

                {trip.interests && (
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    <span className="text-slate-500 font-semibold">Interests:</span> {trip.interests}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <Link
                  to={`/itinerary/${trip.id}`}
                  className="px-4 py-2 rounded-xl bg-violet-600/10 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </Link>

                <button
                  onClick={() => setDeleteModalId(trip.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Delete Trip"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-slate-900 p-6 text-center shadow-2xl backdrop-blur-2xl">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Delete this itinerary?</h4>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              This will permanently delete this travel plan and its AI generation cache.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripHistory;