import { opportunities } from '../data/opportunities';
import { VolunteerOpportunity } from '../models/VolunteerOpportunity';
import { getDistanceInMiles, getCoordsFromZip } from '../utils/geolocation';

// The updated interface that includes all possible filters
interface OpportunityFilters {
  keyword?: string;
  type?: string;
  page?: number;
  limit?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  zipcode?: string;
}

/**
 * Finds and filters opportunities based on various criteria including keywords, type, and location.
 * @param filters - An object containing all filter criteria.
 * @returns A structured object with the paginated list of opportunities and page metadata.
 */
export function findOpportunities(filters: OpportunityFilters) {
  // Destructure all possible filters, providing default values for pagination
  const { keyword, type, page = 1, limit = 10, radius, zipcode } = filters;
  let { latitude, longitude } = filters;
  
  // 1. Start with the full, unfiltered list of opportunities.
  let filteredResults = [...opportunities];

  // 2. Apply keyword filter if it exists.
  if (keyword) {
    const keywordLower = keyword.toLowerCase();
    filteredResults = filteredResults.filter(opp =>
      opp.title.toLowerCase().includes(keywordLower) ||
      opp.description.toLowerCase().includes(keywordLower)
    );
  }

  // 3. Apply type filter if it exists.
  if (type) {
    const typeLower = type.toLowerCase();
    filteredResults = filteredResults.filter(opp =>
      opp.type.toLowerCase() === typeLower
    );
  }

  // 4. --- NEW: Location Filtering Logic ---
  // If a zipcode is provided, use it to get coordinates. This will override any lat/lng passed directly.
  if (zipcode) {
    const coords = getCoordsFromZip(zipcode);
    if (coords) {
      latitude = coords.lat;
      longitude = coords.lon;
    }
  }

  // If we have a center point (lat/lng) and a search radius, filter by distance.
  if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
    filteredResults = filteredResults.filter(opp => {
      // Ensure the opportunity has coordinates before trying to calculate distance.
      if (opp.latitude === undefined || opp.longitude === undefined) {
        return false;
      }
      const distance = getDistanceInMiles(latitude!, longitude!, opp.latitude, opp.longitude);
      return distance <= radius;
    });
  }
  // --- END of Location Filtering ---

  // 5. After all filtering, calculate total counts from the *filtered* list.
  const totalOpportunities = filteredResults.length;
  const totalPages = Math.ceil(totalOpportunities / limit);

  // 6. Slice the filtered list to get the items for the current page.
  const startIndex = (page - 1) * limit;
  const paginatedOpportunities = filteredResults.slice(startIndex, startIndex + limit);

  // 7. Return the structured response object.
  return {
    opportunities: paginatedOpportunities,
    currentPage: page,
    totalPages,
    totalOpportunities,
  };
}

/**
 * Finds a single opportunity by its unique ID.
 * @param id - The ID of the opportunity to find.
 * @returns A VolunteerOpportunity object or undefined if not found.
 */
export function findOpportunityById(id: string): VolunteerOpportunity | undefined {
  return opportunities.find(opp => opp.id === id);
}