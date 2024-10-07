import axios from 'axios';

const API_URL = 'https://api.openf1.org';

// Get latest race
export const getLatestRace = async () => {
  const response = await axios.get(`${API_URL}/races?limit=1&sort=-date`);
  return response.data[0];
};

export const getDriverLapData = async (driverId) => {
  const latestRace = await getLatestRace();
  const response = await axios.get(`${API_URL}/races/${latestRace.id}/laps?driver=${driverId}`);
  return response.data;
};
