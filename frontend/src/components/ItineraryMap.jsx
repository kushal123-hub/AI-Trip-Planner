import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Hotel, 
  Utensils, 
  Compass, 
  Layers, 
  Calendar 
} from "lucide-react";
import { getCityCenter, getOffsetCoordinates, extractPlaceName } from "../utils/geoUtils";

// Custom Leaflet DivIcons with SVG & glow
const createCustomIcon = (type, numberStr = "") => {
  let color = "#8b5cf6"; // Violet for activities
  let bgGradient = "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)";
  let border = "#c084fc";
  let shadow = "rgba(168, 85, 247, 0.4)";

  if (type === "hotel") {
    color = "#06b6d4"; // Cyan
    bgGradient = "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)";
    border = "#38bdf8";
    shadow = "rgba(6, 182, 212, 0.4)";
  } else if (type === "restaurant") {
    color = "#f59e0b"; // Amber
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

// Map Recenter Helper Component
const ChangeMapView = ({ center, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 1 });
    } else if (center) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, bounds, map]);
  return null;
};

const ItineraryMap = ({ itinerary, destination }) => {
  const [activeDay, setActiveDay] = useState("all"); // "all" or day number
  const [showHotels, setShowHotels] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);

  // Compute baseline coordinates
  const cityCenter = useMemo(() => getCityCenter(destination), [destination]);

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
      const name = typeof h === "string" ? h.replace(/\s*\(.*?\)/, "").trim() : h;
      return {
        id: `hotel-${idx}`,
        type: "hotel",
        placeName: name,
        fullText: h,
        coordinates: getOffsetCoordinates(cityCenter, name + "hotel", idx + 20, 0.022),
      };
    });

    // 3. Process Restaurants
    const restaurants = (itinerary.recommended_restaurants || []).map((r, idx) => {
      const name = typeof r === "string" ? r.replace(/\s*\(.*?\)/, "").trim() : r;
      return {
        id: `rest-${idx}`,
        type: "restaurant",
        placeName: name,
        fullText: r,
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

  // Determine active visible markers based on selected day
  const visibleActivityMarkers = useMemo(() => {
    if (activeDay === "all") {
      return Object.values(markersByDay).flat();
    }
    return markersByDay[activeDay] || [];
  }, [markersByDay, activeDay]);

  // Active Route Polylines for day-by-day
  const routePolylines = useMemo(() => {
    if (activeDay === "all") {
      return Object.entries(markersByDay).map(([d, markers]) => ({
        day: d,
        color: "#8b5cf6",
        coords: markers.map((m) => m.coordinates),
      }));
    }
    const dayMarkers = markersByDay[activeDay] || [];
    return [
      {
        day: activeDay,
        color: "#a855f7",
        coords: dayMarkers.map((m) => m.coordinates),
      },
    ];
  }, [markersByDay, activeDay]);

  // Compute bounding box for map view
  const activeBounds = useMemo(() => {
    const points = visibleActivityMarkers.map((m) => m.coordinates);
    if (showHotels) hotelMarkers.forEach((h) => points.push(h.coordinates));
    if (showRestaurants) restaurantMarkers.forEach((r) => points.push(r.coordinates));
    return points.length > 0 ? points : [cityCenter];
  }, [visibleActivityMarkers, hotelMarkers, restaurantMarkers, showHotels, showRestaurants, cityCenter]);

  const openGoogleMaps = (query) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ", " + destination)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-3xl border border-white/15 bg-slate-900/80 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col">
      
      {/* Map Control Bar */}
      <div className="p-4 bg-slate-950/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
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

      {/* Embedded Leaflet Map */}
      <div className="h-[450px] sm:h-[520px] w-full relative">
        <MapContainer
          center={cityCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          {/* CartoDB Dark Matter Tiles (High performance, dark aesthetic, free) */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <ChangeMapView bounds={activeBounds} center={cityCenter} />

          {/* Activity Polylines */}
          {routePolylines.map((route, i) => (
            <Polyline
              key={i}
              positions={route.coords}
              pathOptions={{
                color: route.color,
                weight: 4,
                opacity: 0.8,
                dashArray: activeDay === "all" ? "6, 6" : undefined,
              }}
            />
          ))}

          {/* Activity Markers */}
          {visibleActivityMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.coordinates}
              icon={createCustomIcon("activity", `${marker.stepNumber}`)}
            >
              <Popup>
                <div className="p-3.5 min-w-[200px] max-w-[260px] space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-violet-600/30 text-violet-300 text-[10px] font-bold uppercase tracking-wider">
                      Day {marker.day} • Stop {marker.stepNumber}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {marker.placeName}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {marker.fullText}
                  </p>
                  <button
                    onClick={() => openGoogleMaps(marker.placeName)}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Navigate in Google Maps</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hotel Markers */}
          {showHotels &&
            hotelMarkers.map((hotel) => (
              <Marker
                key={hotel.id}
                position={hotel.coordinates}
                icon={createCustomIcon("hotel", "H")}
              >
                <Popup>
                  <div className="p-3.5 min-w-[200px] max-w-[260px] space-y-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-600/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                      Accommodation
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {hotel.placeName}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {hotel.fullText}
                    </p>
                    <button
                      onClick={() => openGoogleMaps(hotel.placeName)}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Find on Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Restaurant Markers */}
          {showRestaurants &&
            restaurantMarkers.map((rest) => (
              <Marker
                key={rest.id}
                position={rest.coordinates}
                icon={createCustomIcon("restaurant", "R")}
              >
                <Popup>
                  <div className="p-3.5 min-w-[200px] max-w-[260px] space-y-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-600/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                      Dining Spot
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {rest.placeName}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {rest.fullText}
                    </p>
                    <button
                      onClick={() => openGoogleMaps(rest.placeName)}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

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
