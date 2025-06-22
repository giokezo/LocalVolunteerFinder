import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const registerUser = async (userData: RegisterData) => {
  const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: LoginCredentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  const { token } = response.data;

  if (token) {
    localStorage.setItem('token', token);
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await axios.get(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
