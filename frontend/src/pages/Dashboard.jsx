import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  PlusCircle, 
  History, 
  MapPin, 
  Calendar, 
  Wallet, 
  Compass, 
  Clock, 
  Trash2, 
  Eye, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getCurrentUser } from "../services/authService";
import API from "../api/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalId, setDeleteModalId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        const tripsResponse = await API.get("/trip/history");
        setTrips(tripsResponse.data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try logging in again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const confirmDeleteTrip = async () => {
    if (!deleteModalId) return;
    try {
      await API.delete(`/trip/${deleteModalId}`);
      setTrips(trips.filter((trip) => trip.id !== deleteModalId));
      setDeleteModalId(null);
    } catch (err) {
      alert("Failed to delete trip.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-violet-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Loading your travel dashboard...</p>
        </div>
      </div>
    );
  }

  const totalTrips = trips.length;
  const totalBudget = trips.reduce((sum, trip) => sum + parseFloat(trip.budget), 0);
  const upcomingTrips = trips.filter((t) => new Date(t.start_date) >= new Date()).length;
  const recentTrips = trips.slice(0, 4);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-violet-950/80 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden mb-8">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explorer Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">{user?.username || "Explorer"}</span>!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
              Ready to embark on your next adventure? Design bespoke AI travel itineraries or review your past travel plans below.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/create-trip"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 transition hover:scale-105"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Plan New Journey</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        
        {/* Stat 1 */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Compass className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Journeys Planned</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">{totalTrips}</h3>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wallet className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Planned Budget</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5">
              ₹{totalBudget.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Upcoming Departures</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-0.5">{upcomingTrips}</h3>
          </div>
        </div>

      </div>

      {/* Main Grid: Quick Launcher & Recent Journeys */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Actions & Tips (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span>Quick Actions</span>
            </h3>

            <div className="space-y-2.5">
              <Link
                to="/create-trip"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-violet-500/30 bg-violet-600/10 hover:bg-violet-600/20 text-white text-xs font-semibold transition group"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="h-4 w-4 text-violet-400" />
                  <span>Generate New Itinerary</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                to="/trip-history"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition group"
              >
                <div className="flex items-center gap-2.5">
                  <History className="h-4 w-4 text-cyan-400" />
                  <span>Browse Saved Journeys ({totalTrips})</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* AI Traveler Pro-Tip */}
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span>AI Trip Tip</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When specifying your destination in the AI Planner, feel free to add regional tags (e.g. "Kyoto with focus on Arashiyama & Gion") for laser-focused recommendations.
            </p>
          </div>
        </div>

        {/* Right Column: Recent Trips Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Trips</h3>
            {totalTrips > 4 && (
              <Link to="/trip-history" className="text-xs font-semibold text-violet-400 hover:underline">
                View all ({totalTrips})
              </Link>
            )}
          </div>

          {recentTrips.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/40 p-12 text-center">
              <Compass className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">No trips crafted yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Start your adventure today by creating your first AI-customized travel itinerary.
              </p>
              <Link
                to="/create-trip"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-md shadow-violet-600/30"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create Your First Trip</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl flex flex-col justify-between hover:border-violet-500/40 transition-all group shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 border border-violet-500/20 text-violet-300">
                          {trip.travel_style || "Curated"}
                        </span>
                        <h4 className="text-base font-bold text-white mt-1.5 truncate">
                          {trip.destination}
                        </h4>
                      </div>
                      {trip.ai_itinerary ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                          AI Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-slate-400">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                      </p>
                      <p className="flex items-center gap-1.5 font-semibold text-emerald-400">
                        <Wallet className="h-3.5 w-3.5" />
                        <span>₹{parseFloat(trip.budget).toLocaleString("en-IN")}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/itinerary/${trip.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-violet-600/10 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Dossier</span>
                    </Link>

                    <button
                      onClick={() => setDeleteModalId(trip.id)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete Trip"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-slate-900 p-6 text-center shadow-2xl backdrop-blur-2xl">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Delete this travel itinerary?</h4>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              This action cannot be undone and will permanently remove this itinerary from your records.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTrip}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md shadow-rose-600/30"
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

export default Dashboard;