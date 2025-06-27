import axios from 'axios';
import type { VolunteerOpportunity } from '../types/VolunteerOpportunity';

const API_URL = 'http://localhost:3000/api/opportunities';

// Define the exact shape of the API response object we expect from the backend.
export interface OpportunitiesResponse {
  opportunities: VolunteerOpportunity[];
  currentPage: number;
  totalPages: number;
  totalOpportunities: number;
}

/**
 * Fetches a paginated and filtered list of volunteer opportunities.
 * @param page - The current page number to fetch.
 * @param limit - The number of items per page.
 * @param filters - An object containing optional search and location filters.
 * @returns A promise that resolves to the structured OpportunitiesResponse object.
 */
export const getOpportunities = async (
  page = 1, 
  limit = 10, 
  filters: { 
    keyword?: string; 
    type?: string;
    zipcode?: string;
    radius?: number;
    latitude?: number;
    longitude?: number;
  } = {}
): Promise<OpportunitiesResponse> => {
  
  // Create URL parameters for the API request.
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // Append standard filters if they exist
  if (filters.keyword) {
    params.append('keyword', filters.keyword);
  }
  if (filters.type) {
    params.append('type', filters.type);
  }

  // --- NEW: Append location filters if they exist ---
  if (filters.zipcode) {
    params.append('zipcode', filters.zipcode);
  }
  if (filters.radius) {
    params.append('radius', filters.radius.toString());
  }
  if (filters.latitude) {
    params.append('latitude', filters.latitude.toString());
  }
  if (filters.longitude) {
    params.append('longitude', filters.longitude.toString());
  }

  // Make the GET request. The generic <OpportunitiesResponse> tells Axios
  // that we expect `response.data` to conform to our interface.
  const response = await axios.get<OpportunitiesResponse>(`${API_URL}?${params.toString()}`);
  
  // Axios wraps the actual server response in a `data` property.
  // We return `response.data` to pass the clean JSON object to our components.
  return response.data;
};

/**
 * Deletes an opportunity.
 * @param opportunityId - The ID of the opportunity to delete.
 */
export const deleteOpportunity = async (opportunityId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('User is not authenticated');

  await axios.delete(`${API_URL}/${opportunityId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * Creates a new opportunity.
 * @param opportunityData - The data for the new opportunity.
 */
export const createOpportunity = async (opportunityData: Omit<VolunteerOpportunity, 'id' | 'attendees' | 'organizerId'>) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('User is not authenticated');

  const response = await axios.post(API_URL, opportunityData, {
      headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

/**
 * Allows a logged-in user to sign up for a specific opportunity.
 * @param opportunityId - The ID of the opportunity to sign up for.
 * @returns A promise that resolves with the server's confirmation message.
 */
export const signUpForOpportunity = async (opportunityId: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not authenticated');
  }

  const response = await axios.post(
    `${API_URL}/${opportunityId}/signup`,
    {}, // The POST body is empty for this request
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};