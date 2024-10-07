import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get latest race
export const getLatestRace = async () => {
  const response = await axios.get(`${API_URL}/latest-race`);
  return response.data;
};

// Get lap data for specific driver in the latest race
export const getDriverLapData = async (driverId) => {
  const response = await axios.get(`${API_URL}/latest-race/driver/${driverId}`);
  return response.data;
};
