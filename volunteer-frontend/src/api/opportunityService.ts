import axios from 'axios';
import type { VolunteerOpportunity } from '../types/VolunteerOpportunity';

const API_URL = 'http://localhost:3000/api/opportunities';

export const getOpportunities = async (): Promise<VolunteerOpportunity[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const signUpForOpportunity = async (opportunityId: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('User is not authenticated');

  const response = await axios.post(
    `${API_URL}/${opportunityId}/signup`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
