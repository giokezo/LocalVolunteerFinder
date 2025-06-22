import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/users';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
export const getSavedOpportunities = async () => {
  const response = await axios.get(`${BASE_URL}/me/saved-opportunities`, getAuthHeaders());
  return response.data;
};

export const saveOpportunity = async (opportunityId: string) => {
  await axios.post(`${BASE_URL}/me/saved-opportunities`, { opportunityId }, getAuthHeaders());
};

export const unsaveOpportunity = async (opportunityId: string) => {
  await axios.delete(`${BASE_URL}/me/saved-opportunities/${opportunityId}`, getAuthHeaders());
};
