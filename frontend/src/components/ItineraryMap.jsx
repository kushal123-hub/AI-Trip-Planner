import React, { useState, useMemo, useEffect, useRef } from "react";
import * as L_module from "leaflet";
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Hotel, 
  Utensils, 
  Compass, 
  Calendar 
} from "lucide-react";
import { getCityCenter, getOffsetCoordinates, extractPlaceName } from "../utils/geoUtils";

// Normalize Leaflet export across ESM/CJS
const L = L_module.default || L_module;

const ItineraryMap = ({ itinerary, destination }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const [activeDay, setActiveDay] = useState("all");
  const [showHotels, setShowHotels] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Compute baseline coordinates
  const cityCenter = useMemo(() => {
    try {
      return getCityCenter(destination);
    } catch (e) {
      return [35.0116, 135.7681];
    }
  }, [destination]);

  // Extract and build structured map markers
  const { markersByDay, hotelMarkers, restaurantMarkers, allDayNumbers } = useMemo(() => {
    if (!itinerary) {
      return { markersByDay: {}, hotelMarkers: [], restaurantMarkers: [], allDayNumbers: [] };
    }

    const byDay = {};
    const dayNumbers = [];

    // 1. Process Day Activities
    itinerary.days?.forEach((dayObj, dayIdx) => {
      dayNumbers.push(dayObj.day);
      byDay[dayObj.day] = [];

      dayObj.activities?.forEach((act, actIdx) => {
        const placeName = extractPlaceName(act);
        const coords = getOffsetCoordinates(cityCenter, placeName, actIdx + dayIdx * 4, 0.032);
        
        byDay[dayObj.day].push({
          id: `d${dayObj.day}-a${actIdx}`,
          type: "activity",
          day: dayObj.day,
          stepNumber: actIdx + 1,
          placeName,
          fullText: act,
          coordinates: coords,
        });
      });
    });

    // 2. Process Hotels
    const hotels = (itinerary.recommended_hotels || []).map((h, idx) => {
      const name = typeof h === "string" ? h.replace(/\s*\(.*?\)/, "").trim() : (h || "Hotel");
      return {
        id: `hotel-${idx}`,
        type: "hotel",
        placeName: name,
        fullText: typeof h === "string" ? h : name,
        coordinates: getOffsetCoordinates(cityCenter, name + "hotel", idx + 20, 0.022),
      };
    });

    // 3. Process Restaurants
    const restaurants = (itinerary.recommended_restaurants || []).map((r, idx) => {
      const name = typeof r === "string" ? r.replace(/\s*\(.*?\)/, "").trim() : (r || "Restaurant");
      return {
        id: `rest-${idx}`,
        type: "restaurant",
        placeName: name,
        fullText: typeof r === "string" ? r : name,
        coordinates: getOffsetCoordinates(cityCenter, name + "rest", idx + 40, 0.028),
      };
    });

    return {
      markersByDay: byDay,
      hotelMarkers: hotels,
      restaurantMarkers: restaurants,
      allDayNumbers: dayNumbers,
    };
  }, [itinerary, cityCenter]);

  // Helper to create custom div icon safely
  const createIcon = (type, numberStr = "") => {
    if (!L || typeof L.divIcon !== "function") return null;

    let bgGradient = "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)";
    let border = "#c084fc";
    let shadow = "rgba(168, 85, 247, 0.4)";

    if (type === "hotel") {
      bgGradient = "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)";
      border = "#38bdf8";
      shadow = "rgba(6, 182, 212, 0.4)";
    } else if (type === "restaurant") {
      bgGradient = "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)";
      border = "#fbbf24";
      shadow = "rgba(245, 158, 11, 0.4)";
    }

    const html = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: ${bgGradient};
        border: 2px solid ${border};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 0 14px ${shadow};
        cursor: pointer;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: 800;
          font-size: 11px;
          font-family: sans-serif;
        ">${numberStr}</span>
      </div>
    `;

    return L.divIcon({
      className: "custom-map-pin",
      html: html,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof window === "undefined" || !L || typeof L.map !== "function") {
      setMapError(true);
      return;
    }

    // Cleanup previous map instance if exists
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        // ignore
      }
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: cityCenter,
        zoom: 13,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
      setMapError(false);
    } catch (e) {
      console.error("Leaflet map initialization error:", e);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, [cityCenter]);

  // Update Layers & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup || !L) return;

    try {
      layerGroup.clearLayers();
      const boundsPoints = [];

      // 1. Draw Route Polylines
      if (activeDay === "all") {
        Object.entries(markersByDay).forEach(([d, markers]) => {
          if (markers.length > 1) {
            const poly = L.polyline(markers.map((m) => m.coordinates), {
              color: "#8b5cf6",
              weight: 3.5,
              opacity: 0.7,
              dashArray: "6, 6",
            });
            poly.addTo(layerGroup);
          }
        });
      } else {
        const dayMarkers = markersByDay[activeDay] || [];
        if (dayMarkers.length > 1) {
          const poly = L.polyline(dayMarkers.map((m) => m.coordinates), {
            color: "#a855f7",
            weight: 4,
            opacity: 0.9,
          });
          poly.addTo(layerGroup);
        }
      }

      // 2. Add Activity Markers
      const visibleActivities = activeDay === "all" ? Object.values(markersByDay).flat() : markersByDay[activeDay] || [];
      visibleActivities.forEach((m) => {
        boundsPoints.push(m.coordinates);
        const icon = createIcon("activity", `${m.stepNumber}`);
        const marker = icon ? L.marker(m.coordinates, { icon }) : L.marker(m.coordinates);

        const popupContent = document.createElement("div");
        popupContent.className = "p-3.5 min-w-[200px] max-w-[260px] space-y-2";
        popupContent.innerHTML = `
          <div class="flex items-center gap-1.5">
            <span style="background: rgba(139, 92, 246, 0.25); color: #c084fc; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
              Day ${m.day} • Stop ${m.stepNumber}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0 2px 0;">${m.placeName}</h4>
          <p style="font-size: 11px; color: #cbd5e1; line-height: 1.35; margin: 0;">${m.fullText}</p>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.placeName + ", " + destination)}" target="_blank" rel="noreferrer" style="display: block; width: 100%; margin-top: 8px; padding: 6px 12px; background: #7c3aed; color: #ffffff; text-align: center; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;">
            Navigate in Google Maps ↗
          </a>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(layerGroup);
      });

      // 3. Add Hotels
      if (showHotels) {
        hotelMarkers.forEach((h) => {
          boundsPoints.push(h.coordinates);
          const icon = createIcon("hotel", "H");
          const marker = icon ? L.marker(h.coordinates, { icon }) : L.marker(h.coordinates);

          const popupContent = document.createElement("div");
          popupContent.className = "p-3.5 min-w-[200px] max-w-[260px] space-y-2";
          popupContent.innerHTML = `
            <span style="background: rgba(6, 182, 212, 0.25); color: #38bdf8; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
              Accommodation
            </span>
            <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0 2px 0;">${h.placeName}</h4>
            <p style="font-size: 11px; color: #cbd5e1; line-height: 1.35; margin: 0;">${h.fullText}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.placeName + ", " + destination)}" target="_blank" rel="noreferrer" style="display: block; width: 100%; margin-top: 8px; padding: 6px 12px; background: #0891b2; color: #ffffff; text-align: center; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;">
              Find on Google Maps ↗
            </a>
          `;

          marker.bindPopup(popupContent);
          marker.addTo(layerGroup);
        });
      }

      // 4. Add Restaurants
      if (showRestaurants) {
        restaurantMarkers.forEach((r) => {
          boundsPoints.push(r.coordinates);
          const icon = createIcon("restaurant", "R");
          const marker = icon ? L.marker(r.coordinates, { icon }) : L.marker(r.coordinates);

          const popupContent = document.createElement("div");
          popupContent.className = "p-3.5 min-w-[200px] max-w-[260px] space-y-2";
          popupContent.innerHTML = `
            <span style="background: rgba(245, 158, 11, 0.25); color: #fbbf24; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
              Dining Spot
            </span>
            <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0 2px 0;">${r.placeName}</h4>
            <p style="font-size: 11px; color: #cbd5e1; line-height: 1.35; margin: 0;">${r.fullText}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.placeName + ", " + destination)}" target="_blank" rel="noreferrer" style="display: block; width: 100%; margin-top: 8px; padding: 6px 12px; background: #d97706; color: #ffffff; text-align: center; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;">
              View on Google Maps ↗
            </a>
          `;

          marker.bindPopup(popupContent);
          marker.addTo(layerGroup);
        });
      }

      // Recenter map to bounds
      if (boundsPoints.length > 1) {
        map.fitBounds(boundsPoints, { padding: [50, 50], maxZoom: 15 });
      } else if (boundsPoints.length === 1) {
        map.setView(boundsPoints[0], 13);
      }
    } catch (err) {
      console.error("Error updating map layers:", err);
    }
  }, [activeDay, showHotels, showRestaurants, markersByDay, hotelMarkers, restaurantMarkers, destination]);

  return (
    <div className="rounded-3xl border border-white/15 bg-slate-900/80 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col">
      
      {/* Map Control Bar */}
      <div className="p-4 bg-slate-950/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveDay("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeDay === "all"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            All Days Route
          </button>
          {allDayNumbers.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setActiveDay(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeDay === d
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>

        {/* Toggle Layers */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowHotels(!showHotels)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer ${
              showHotels 
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" 
                : "bg-white/5 border-white/5 text-slate-500"
            }`}
          >
            <Hotel className="h-3.5 w-3.5" />
            <span>Stays</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRestaurants(!showRestaurants)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer ${
              showRestaurants 
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300" 
                : "bg-white/5 border-white/5 text-slate-500"
            }`}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>Dining</span>
          </button>
        </div>

      </div>

      {/* Map Container / Fallback */}
      {mapError ? (
        <div className="h-[300px] w-full flex flex-col items-center justify-center p-6 text-center bg-slate-950/60">
          <Compass className="h-10 w-10 text-violet-400 mb-2 animate-pulse" />
          <p className="text-xs font-bold text-white">Interactive Map Ready</p>
          <p className="text-[11px] text-slate-400 max-w-sm mt-1">
            Displaying coordinates for {destination || "Selected Destination"}.
          </p>
        </div>
      ) : (
        <div 
          ref={mapContainerRef} 
          className="h-[420px] sm:h-[480px] w-full relative bg-[#090d16]" 
        />
      )}

      {/* Map Footer Legend */}
      <div className="p-3 bg-slate-950/90 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 px-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500 shadow-sm shadow-violet-500" />
            <span>Activity Stops</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
            <span>Stays & Hotels</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
            <span>Gastronomy</span>
          </span>
        </div>
        <span className="text-slate-500 italic hidden sm:block">Click any marker for details & turn-by-turn navigation</span>
      </div>

    </div>
  );
};

export default ItineraryMap;
