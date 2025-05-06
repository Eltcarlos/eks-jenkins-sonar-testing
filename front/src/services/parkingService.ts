import axios from 'axios';
export const BackendUrl = import.meta.env.VITE_BACKEND_URL

const API_URL =  BackendUrl;

export const assignParking = async (studentId: string, spotNumber: string) => {
  try {
    const response = await axios.post(`${API_URL}/parking/assign`, { studentId, spotNumber });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to assign parking');
    }
    throw new Error('Network error occurred');
  }
};

export const getUserParking = async () => {
  try {
    const response = await axios.get(`${API_URL}/parking/my-parking`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // If the error is that no parking is found, return null instead of throwing
      if (error.response.status === 404) {
        return null;
      }
      throw new Error(error.response.data.error || 'Failed to get parking information');
    }
    throw new Error('Network error occurred');
  }
};

export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/students`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to get students list');
    }
    throw new Error('Network error occurred');
  }
};

export const getAvailableParkingSpots = async () => {
  try {
    const response = await axios.get(`${API_URL}/parking/available`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to get available spots');
    }
    throw new Error('Network error occurred');
  }
};