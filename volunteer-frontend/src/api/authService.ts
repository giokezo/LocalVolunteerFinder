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
