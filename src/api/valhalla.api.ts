import polyline from "@mapbox/polyline";
import { api } from "./axiosInstance";

// 🗺️ Valhalla routing types
export interface ValhallaLocation {
  lat: number;
  lon: number;
  street?: string;
}

export interface ValhallaCostingOptions {
  auto?: {
    use_highways?: number;
    use_tolls?: number;
    use_ferry?: number;
    country_crossing_penalty?: number;
  };
  pedestrian?: {
    walking_speed?: number;
    walkway_factor?: number;
    sidewalk_factor?: number;
  };
}

export interface ValhallaRouteRequest {
  locations: ValhallaLocation[];
  costing: "auto" | "pedestrian" | "bicycle" | "car";
  costing_options?: ValhallaCostingOptions;
  directions_options?: {
    units?: "kilometers" | "miles";
    language?: string;
    narrative?: boolean;
  };
  format?: "json";
  id?: string;
}

export interface ValhallaManeuver {
  type: number;
  instruction: string;
  verbal_pre_transition_instruction?: string;
  verbal_post_transition_instruction?: string;
  street_names?: string[];
  time: number;
  length: number;
  begin_shape_index: number;
  end_shape_index: number;
  toll?: boolean;
  highway?: boolean;
  rough?: boolean;
  gate?: boolean;
  ferry?: boolean;
  travel_mode?: string;
  travel_type?: string;
  bearing_before?: number;
}

export interface ValhallaLeg {
  maneuvers: ValhallaManeuver[];
  summary: {
    time: number;
    length: number;
    has_toll: boolean;
    has_highway: boolean;
    has_ferry: boolean;
  };
  shape: string; // 📈 Encoded polyline
}

export interface ValhallaTrip {
  status: number;
  status_message: string;
  units: string;
  language: string;
  locations: Array<{
    lat: number;
    lon: number;
    side_of_street?: string;
  }>;
  legs: ValhallaLeg[];
  summary: {
    time: number;
    length: number;
    has_toll: boolean;
    has_highway: boolean;
    has_ferry: boolean;
    min_lat: number;
    min_lon: number;
    max_lat: number;
    max_lon: number;
  };
}

export interface ValhallaRouteResponse {
  trip: ValhallaTrip;
  id?: string;
}

// 🎯 Maneuver type mappings for better UX
export const MANEUVER_TYPES = {
  0: "None",
  1: "Start",
  2: "Start right",
  3: "Start left",
  4: "Destination",
  5: "Destination right",
  6: "Destination left",
  7: "Becomes",
  8: "Continue",
  9: "Slight right",
  10: "Right",
  11: "Sharp right",
  12: "U-turn right",
  13: "U-turn left",
  14: "Sharp left",
  15: "Left",
  16: "Slight left",
  17: "Ramp straight",
  18: "Ramp right",
  19: "Ramp left",
  20: "Exit right",
  21: "Exit left",
  22: "Stay straight",
  23: "Stay right",
  24: "Stay left",
  25: "Merge",
  26: "Roundabout enter",
  27: "Roundabout exit",
  28: "Ferry enter",
  29: "Ferry exit",
} as const;

// 🌐 Default Valhalla server URL - update this to your Valhalla instance
const VALHALLA_BASE_URL = import.meta.env.VITE_VALHALLA_URL || "https://valhalla1.openstreetmap.de";

/**
 * 🚗 Request a route from Valhalla
 */
export async function getValhallaRoute(request: ValhallaRouteRequest): Promise<ValhallaRouteResponse> {
  try {
    const response = await api.post(`${VALHALLA_BASE_URL}/route`, request, {
      headers: {
        "Content-Type": "application/json",
      },
      // 🕐 Extended timeout for routing calculations
      timeout: 30000,
    });

    return response.data;
  } catch (error: any) {
    console.error("🚫 Valhalla route request failed:", error);

    if (error.response?.data) {
      throw new Error(`Valhalla API error: ${error.response.data.error_message || error.response.data.message || "Unknown error"}`);
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("Route request timed out. Please try again.");
    }

    throw new Error(`Failed to get route: ${error.message}`);
  }
}

/**
 * 📍 Decode Valhalla polyline to Leaflet coordinates
 */
export function decodePolyline(encodedPolyline: string, precision: number = 6): [number, number][] {
  try {
    const decoded = polyline.decode(encodedPolyline, precision);
    // ⚠️ Polyline library returns [lat, lng], Leaflet expects [lat, lng] - no swap needed
    return decoded;
  } catch (error) {
    console.error("🚫 Failed to decode polyline:", error);
    return [];
  }
}

/**
 * 🎯 Get maneuver type description
 */
export function getManeuverTypeDescription(type: number): string {
  return MANEUVER_TYPES[type as keyof typeof MANEUVER_TYPES] || `Unknown maneuver (${type})`;
}

/**
 * 🧭 Calculate distance between two points using Haversine formula
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 🌍 Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance * 1000; // 📏 Convert to meters
}

/**
 * 🎯 Check if user is off the route
 */
export function isOffRoute(
  userLat: number,
  userLon: number,
  routeCoordinates: [number, number][],
  threshold: number = 50, // 📏 meters
): boolean {
  if (routeCoordinates.length === 0) return true;

  // 🔍 Find the closest point on the route
  let minDistance = Infinity;

  for (const [routeLat, routeLon] of routeCoordinates) {
    const distance = calculateDistance(userLat, userLon, routeLat, routeLon);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance > threshold;
}

/**
 * 🗺️ Create a simple route request for pedestrian navigation
 */
export function createPedestrianRouteRequest(from: { lat: number; lon: number }, to: { lat: number; lon: number }): ValhallaRouteRequest {
  return {
    locations: [
      { lat: from.lat, lon: from.lon },
      { lat: to.lat, lon: to.lon },
    ],
    costing: "pedestrian",
    directions_options: {
      units: "kilometers",
      language: "en-US",
      narrative: true,
    },
    format: "json",
  };
}

/**
 * 🚗 Create a route request for driving
 */
export function createAutoRouteRequest(from: { lat: number; lon: number }, to: { lat: number; lon: number }): ValhallaRouteRequest {
  return {
    locations: [
      { lat: from.lat, lon: from.lon },
      { lat: to.lat, lon: to.lon },
    ],
    costing: "auto",
    costing_options: {
      auto: {
        use_highways: 1.0,
        use_tolls: 0.5,
        use_ferry: 1.0,
      },
    },
    directions_options: {
      units: "kilometers",
      language: "en-US",
      narrative: true,
    },
    format: "json",
  };
}
