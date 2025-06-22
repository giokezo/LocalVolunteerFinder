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
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || 'Registration failed';
  }
};

export const loginUser = async (credentials: LoginCredentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    const { token } = response.data;

    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || 'Login failed';
  }
};


export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  try {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      logoutUser(); // auto-logout on token expiration
    }
    throw error.response?.data?.error || 'Failed to fetch user';
  }
};


