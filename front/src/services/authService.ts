import axios from 'axios';
export const BackendUrl = import.meta.env.VITE_BACKEND_URL

const API_URL =  BackendUrl;
// Set up axios interceptors for handling auth
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to login');
    }
    throw new Error('Network error occurred');
  }
};

export const registerUser = async (name: string, email: string, password: string, idUniversity: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      idUniversity,
      role: 'user' // Default role for new users
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to register');
    }
    throw new Error('Network error occurred');
  }
};

export const getCurrentUser = async () => {
  try {
    // Assuming your backend has a route to get the current user
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get current user');
  }
};

export const changeUserRole = async (userId: string, role: string) => {
  try {
    const response = await axios.patch(`${API_URL}/auth/changerole/${userId}`, { role });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to change role');
    }
    throw new Error('Network error occurred');
  }
};