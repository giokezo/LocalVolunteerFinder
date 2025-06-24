import axios from 'axios';
import type { VolunteerOpportunity } from '../types/VolunteerOpportunity';

const BASE_URL = 'http://localhost:3000/api/users';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not authenticated');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * @desc Fetches the full opportunity objects that the user has saved.
 * @returns A promise that resolves to an array of VolunteerOpportunity.
 */
export const getSavedOpportunities = async (): Promise<VolunteerOpportunity[]> => {
  const response = await axios.get<VolunteerOpportunity[]>(`${BASE_URL}/me/saved-opportunities`, getAuthHeaders());
  return response.data;
};

/**
 * @desc Saves an opportunity to the user's profile.
 * @param opportunityId The ID of the opportunity to save.
 */
export const saveOpportunity = async (opportunityId: string) => {
  await axios.post(`${BASE_URL}/me/saved-opportunities`, { opportunityId }, getAuthHeaders());
};

/**
 * @desc Removes a saved opportunity from the user's profile.
 * @param opportunityId The ID of the opportunity to unsave.
 */
export const unsaveOpportunity = async (opportunityId: string) => {
  await axios.delete(`${BASE_URL}/me/saved-opportunities/${opportunityId}`, getAuthHeaders());
};