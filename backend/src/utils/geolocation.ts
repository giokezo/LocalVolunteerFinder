/**
 * Calculates the distance between two lat/lng points in miles using the Haversine formula.
 */
export function getDistanceInMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

/**
 * MOCK FUNCTION: Converts a zip code to coordinates.
 * In a real application, this would use a third-party geocoding API.
 */
export function getCoordsFromZip(zipcode: string): { lat: number; lon: number } | null {
  const zipToCoords: { [key: string]: { lat: number; lon: number } } = {
    '90210': { lat: 34.0901, lon: -118.4065 }, // Beverly Hills
    '94102': { lat: 37.7831, lon: -122.4113 }, // San Francisco
    '92101': { lat: 32.7157, lon: -117.1611 }, // San Diego
  };

  return zipToCoords[zipcode] || null;
}