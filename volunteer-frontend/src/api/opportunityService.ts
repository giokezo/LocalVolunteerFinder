import axios from 'axios';
import type { VolunteerOpportunity } from '../types/VolunteerOpportunity';

const API_URL = 'http://localhost:3000/api/opportunities';

export const getOpportunities = async (): Promise<VolunteerOpportunity[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};
