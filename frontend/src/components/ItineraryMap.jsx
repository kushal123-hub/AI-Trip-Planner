import React, { useState, useMemo, useEffect, useRef } from "react";
import * as L_module from "leaflet";
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Hotel, 
  Utensils, 
  Compass, 
  Calendar,
  Layers,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { getCityCenter, getOffsetCoordinates, extractPlaceName } from "../utils/geoUtils";

// Normalize Leaflet export across ESM/CJS
const L = L_module.default || L_module;

const ItineraryMap = ({ itinerary, destination }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const markersRef = useRef({});

  const [activeDay, setActiveDay] = useState("all");
  const [showHotels, setShowHotels] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
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
  const createIcon = (type, numberStr = "", isSelected = false) => {
    if (!L || typeof L.divIcon !== "function") return null;

    let bgGradient = "linear-gradient(135deg, #08D9D6 0%, #06a8a6 100%)";
    let border = "#08D9D6";
    let shadow = isSelected ? "0 0 25px #08D9D6" : "0 0 14px rgba(8, 217, 214, 0.5)";
    let scale = isSelected ? "scale(1.25)" : "scale(1)";

    if (type === "hotel") {
      bgGradient = "linear-gradient(135deg, #FF2E63 0%, #ff5782 100%)";
      border = "#FF2E63";
      shadow = isSelected ? "0 0 25px #FF2E63" : "0 0 14px rgba(255, 46, 99, 0.5)";
    } else if (type === "restaurant") {
      bgGradient = "linear-gradient(135deg, #f59e0b 0%, #FF2E63 100%)";
      border = "#fbbf24";
      shadow = isSelected ? "0 0 25px #f59e0b" : "0 0 14px rgba(245, 158, 11, 0.5)";
    }

    const html = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: ${bgGradient};
        border: 2.5px solid ${border};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg) ${scale};
        box-shadow: ${shadow};
        cursor: pointer;
        transition: transform 0.2s ease;
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

  // Initialize Map with ESRI World Dark Gray Canvas
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
        zoomControl: false,
      });

      // 1. ESRI Dark Gray Canvas Base Tiles
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &copy; OpenStreetMap contributors',
        maxZoom: 16,
      }).addTo(map);

      // 2. ESRI Dark Gray Reference Labels
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16,
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
      markersRef.current = {};
      const boundsPoints = [];

      // 1. Draw Route Polylines
      if (activeDay === "all") {
        Object.entries(markersByDay).forEach(([d, markers]) => {
          if (markers.length > 1) {
            const poly = L.polyline(markers.map((m) => m.coordinates), {
              color: "#08D9D6",
              weight: 3.5,
              opacity: 0.8,
              dashArray: "6, 6",
            });
            poly.addTo(layerGroup);
          }
        });
      } else {
        const dayMarkers = markersByDay[activeDay] || [];
        if (dayMarkers.length > 1) {
          const poly = L.polyline(dayMarkers.map((m) => m.coordinates), {
            color: "#FF2E63",
            weight: 4.5,
            opacity: 0.95,
          });
          poly.addTo(layerGroup);
        }
      }

      // 2. Add Activity Markers
      const visibleActivities = activeDay === "all" ? Object.values(markersByDay).flat() : markersByDay[activeDay] || [];
      visibleActivities.forEach((m) => {
        boundsPoints.push(m.coordinates);
        const isSelected = selectedSpotId === m.id;
        const icon = createIcon("activity", `${m.stepNumber}`, isSelected);
        const marker = icon ? L.marker(m.coordinates, { icon }) : L.marker(m.coordinates);

        const popupContent = document.createElement("div");
        popupContent.className = "p-3.5 min-w-[200px] max-w-[260px] space-y-2";
        popupContent.innerHTML = `
          <div class="flex items-center gap-1.5">
            <span style="background: rgba(8, 217, 214, 0.2); color: #08D9D6; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
              Day ${m.day} • Stop ${m.stepNumber}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0 2px 0;">${m.placeName}</h4>
          <p style="font-size: 11px; color: #cbd5e1; line-height: 1.35; margin: 0;">${m.fullText}</p>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.placeName + ", " + destination)}" target="_blank" rel="noreferrer" style="display: block; width: 100%; margin-top: 8px; padding: 6px 12px; background: #08D9D6; color: #181b22; text-align: center; border-radius: 8px; font-size: 11px; font-weight: 700; text-decoration: none;">
            Navigate in Google Maps ↗
          </a>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(layerGroup);
        markersRef.current[m.id] = marker;
      });

      // 3. Add Hotels
      if (showHotels) {
        hotelMarkers.forEach((h) => {
          boundsPoints.push(h.coordinates);
          const isSelected = selectedSpotId === h.id;
          const icon = createIcon("hotel", "H", isSelected);
          const marker = icon ? L.marker(h.coordinates, { icon }) : L.marker(h.coordinates);

          const popupContent = document.createElement("div");
          popupContent.className = "p-3.5 min-w-[200px] max-w-[260px] space-y-2";
          popupContent.innerHTML = `
            <span style="background: rgba(255, 46, 99, 0.2); color: #FF2E63; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
              Accommodation
            </span>
            <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0 2px 0;">${h.placeName}</h4>
            <p style="font-size: 11px; color: #cbd5e1; line-height: 1.35; margin: 0;">${h.fullText}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.placeName + ", " + destination)}" target="_blank" rel="noreferrer" style="display: block; width: 100%; margin-top: 8px; padding: 6px 12px; background: #FF2E63; color: #ffffff; text-align: center; border-radius: 8px; font-size: 11px; font-weight: 700; text-decoration: none;">
              Find on Google Maps ↗
            </a>
          `;

          marker.bindPopup(popupContent);
          marker.addTo(layerGroup);
          markersRef.current[h.id] = marker;
        });
      }

      // 4. Add Restaurants
      if (showRestaurants) {
        restaurantMarkers.forEach((r) => {
          boundsPoints.push(r.coordinates);
          const isSelected = selectedSpotId === r.id;
          const icon = createIcon("restaurant", "R", isSelected);
          const marker = icon ? L.marker(r.coordinates, { icon }) : L.marker(r.coordinates);

          const popupContent = document.createElement("div");
          popupContent.className = "p-3.5 min-w-[200px] max-w-[260px] space-y-2";
          popupContent.innerHTML = `
            <span style="background: rgba(245, 158, 11, 0.25); color: #fbbf24; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
              Dining Spot
            </span>
            <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0 2px 0;">${r.placeName}</h4>
            <p style="font-size: 11px; color: #cbd5e1; line-height: 1.35; margin: 0;">${r.fullText}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.placeName + ", " + destination)}" target="_blank" rel="noreferrer" style="display: block; width: 100%; margin-top: 8px; padding: 6px 12px; background: #d97706; color: #ffffff; text-align: center; border-radius: 8px; font-size: 11px; font-weight: 700; text-decoration: none;">
              View on Google Maps ↗
            </a>
          `;

          marker.bindPopup(popupContent);
          marker.addTo(layerGroup);
          markersRef.current[r.id] = marker;
        });
      }

      // Recenter map to bounds
      if (boundsPoints.length > 1) {
        map.fitBounds(boundsPoints, { padding: [40, 40], maxZoom: 15 });
      } else if (boundsPoints.length === 1) {
        map.setView(boundsPoints[0], 13);
      }
    } catch (err) {
      console.error("Error updating map layers:", err);
    }
  }, [activeDay, showHotels, showRestaurants, markersByDay, hotelMarkers, restaurantMarkers, destination, selectedSpotId]);

  // Click on a stop to pan to it on map
  const handleSelectSpot = (spot) => {
    setSelectedSpotId(spot.id);
    const map = mapInstanceRef.current;
    if (map && spot.coordinates) {
      map.flyTo(spot.coordinates, 15, { duration: 1 });
      const marker = markersRef.current[spot.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 600);
      }
    }
  };

  const currentDayActivities = useMemo(() => {
    if (activeDay === "all") {
      return Object.values(markersByDay).flat();
    }
    return markersByDay[activeDay] || [];
  }, [markersByDay, activeDay]);

  return (
    <div className="rounded-3xl border border-white/15 bg-[#252A34]/90 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col">
      
      {/* Map Control Bar */}
      <div className="p-4 bg-[#181b22] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => { setActiveDay("all"); setSelectedSpotId(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeDay === "all"
                ? "bg-[#FF2E63] text-white shadow-md shadow-[#FF2E63]/30"
                : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            All Days Route
          </button>
          {allDayNumbers.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => { setActiveDay(d); setSelectedSpotId(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeDay === d
                  ? "bg-[#FF2E63] text-white shadow-md shadow-[#FF2E63]/30"
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
                ? "bg-[#FF2E63]/20 border-[#FF2E63]/40 text-[#FF2E63] shadow-sm" 
                : "bg-white/5 border-white/5 text-slate-500"
            }`}
          >
            <Hotel className="h-3.5 w-3.5" />
            <span>Stays ({hotelMarkers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRestaurants(!showRestaurants)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer ${
              showRestaurants 
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm" 
                : "bg-white/5 border-white/5 text-slate-500"
            }`}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>Dining ({restaurantMarkers.length})</span>
          </button>
        </div>

      </div>

      {/* Main Map Viewport & Interactive Stops Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative min-h-[460px]">
        
        {/* Map Viewport (8 cols) */}
        <div className="lg:col-span-8 relative h-[380px] lg:h-[480px] w-full bg-[#181b22]">
          {mapError ? (
            <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-[#181b22]">
              <Compass className="h-10 w-10 text-[#08D9D6] mb-2 animate-pulse" />
              <p className="text-xs font-bold text-white">Route Map for {destination}</p>
            </div>
          ) : (
            <div 
              ref={mapContainerRef} 
              className="h-full w-full relative bg-[#181b22]" 
            />
          )}

          {/* Custom Zoom Controls Floating on Map */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="h-8 w-8 rounded-xl bg-[#252A34]/90 hover:bg-[#252A34] border border-white/15 text-white flex items-center justify-center shadow-lg transition"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="h-8 w-8 rounded-xl bg-[#252A34]/90 hover:bg-[#252A34] border border-white/15 text-white flex items-center justify-center shadow-lg transition"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Interactive Stops Quick-Nav Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#181b22]/90 border-t lg:border-t-0 lg:border-l border-white/10 p-4 flex flex-col justify-between max-h-[480px] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-[#08D9D6]" />
                <span>Stops & Highlights ({currentDayActivities.length})</span>
              </span>
            </div>

            <div className="space-y-2 pr-1">
              {currentDayActivities.map((act) => {
                const isSelected = selectedSpotId === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleSelectSpot(act)}
                    className={`w-full text-left p-2.5 rounded-2xl border text-xs transition cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-[#08D9D6]/20 border-[#08D9D6] text-white shadow-md shadow-[#08D9D6]/20"
                        : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10"
                    }`}
                  >
                    <div className="h-6 w-6 rounded-lg bg-[#08D9D6]/30 text-[#08D9D6] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {act.stepNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{act.placeName}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{act.fullText}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#08D9D6]" /> Sights</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#FF2E63]" /> Stays</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Dining</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ItineraryMap;
