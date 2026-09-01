// Database of world destination baseline coordinates
export const cityCoordinatesMap = {
  "kyoto": [35.0116, 135.7681],
  "tokyo": [35.6762, 139.6503],
  "amalfi": [40.6340, 14.6027],
  "amalfi coast": [40.6340, 14.6027],
  "positano": [40.6281, 14.4850],
  "capri": [40.5507, 14.2426],
  "bali": [-8.4095, 115.1889],
  "ubud": [-8.5069, 115.2625],
  "swiss alps": [46.5592, 8.5606],
  "zermatt": [45.9765, 7.7491],
  "interlaken": [46.6863, 7.8632],
  "paris": [48.8566, 2.3522],
  "rome": [41.9028, 12.4964],
  "goa": [15.2993, 74.1240],
  "panaji": [15.4909, 73.8278],
  "jaipur": [26.9124, 75.7873],
  "udaipur": [24.5854, 73.7125],
  "cappadocia": [38.6431, 34.8289],
  "santorini": [36.3932, 25.4615],
  "oia": [36.4618, 25.3753],
  "london": [51.5074, -0.1278],
  "new york": [40.7128, -74.0060],
  "bangkok": [13.7563, 100.5018],
  "dubai": [25.2048, 55.2708],
  "singapore": [1.3521, 103.8198],
  "sydney": [-33.8688, 151.2093],
  "barcelona": [41.3851, 2.1734],
  "amsterdam": [52.3676, 4.9041],
  "iceland": [64.1466, -21.9426],
  "reykjavik": [64.1466, -21.9426],
  "manali": [32.2432, 77.1892],
  "leh": [34.1526, 77.5771],
  "ladakh": [34.1526, 77.5771],
  "varanasi": [25.3176, 82.9739],
  "kerala": [10.8505, 76.2711],
};

// Clean activity text to extract place name
export const extractPlaceName = (activityText) => {
  if (!activityText) return "Activity Location";
  
  // Remove time prefix e.g. "08:30 AM — " or "Morning: "
  let cleaned = activityText.replace(/^(\d{1,2}:\d{2}\s*(AM|PM)?\s*[-—:]?\s*)/i, "");
  cleaned = cleaned.replace(/^(Morning|Afternoon|Evening|Night)\s*[-—:]?\s*/i, "");
  
  // Extract up to the first punctuation or first 45 chars
  const match = cleaned.match(/^([^.,;—–-]+)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return cleaned.slice(0, 40).trim();
};

// In-memory geocoding cache
const geoCache = {};

// Find city center
export const getCityCenter = (destinationStr) => {
  if (!destinationStr) return [35.0116, 135.7681];
  const query = destinationStr.toLowerCase();
  
  for (const [key, coords] of Object.entries(cityCoordinatesMap)) {
    if (query.includes(key)) {
      return coords;
    }
  }
  // Default to global attractive destination center
  return [35.0116, 135.7681];
};

// Generate deterministic offset around city center based on string hash
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const getOffsetCoordinates = (cityCenter, textKey, index = 0, spreadFactor = 0.035) => {
  const hash = hashString(textKey + index);
  // Deterministic angle & radius
  const angle = ((hash % 360) * Math.PI) / 180;
  const radius = (((hash % 100) / 100) * 0.6 + 0.4) * spreadFactor;
  
  const latOffset = Math.sin(angle) * radius;
  const lngOffset = Math.cos(angle) * radius;

  return [cityCenter[0] + latOffset, cityCenter[1] + lngOffset];
};
