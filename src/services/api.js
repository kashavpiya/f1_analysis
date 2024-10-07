import axios from 'axios';

const API_URL = 'https://api.openf1.org/v1';

// Get the latest session (race)
export const getLatestSession = async () => {
    try {
      const response = await axios.get(`${API_URL}/sessions`, {
        params: {
          country_name: 'Singapore',
          session_name: 'Race',
          year: 2024
        }
      });
      return response.data[0]; // Assuming the first result is the latest session
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  };

export const getDriverLapData = async (driverNumber) => {
    try {
      const latestSession = await getLatestSession();
  
      if (!latestSession || !latestSession.session_key) {
        throw new Error('Invalid session data. No session key found.');
      }
  
      const response = await axios.get(`${API_URL}/drivers`, {
        params: {
          driver_number: driverNumber,
          session_key: latestSession.session_key
        }
      });
  
      return response.data;
    } catch (error) {
      console.error(`Error fetching lap data for driver ${driverNumber}:`, error);
      throw error;
    }
  };