import axios from 'axios';

const API_URL = 'https://api.openf1.org/v1';

// Get the latest session (race)
export const getLatestSession = async (selectedTrack) => {
  try {
    const response = await axios.get(`${API_URL}/sessions`, {
      params: {
        country_name: selectedTrack,
        session_name: 'Race',
        year: 2024
      }
    });
    console.log(response);
    return response.data[0]; // Assuming the first result is the latest session
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};

// Get driver lap data
export const getDriverLapData = async (driverNumber, lapNumber, selectedTrack) => {
  try {
    // Await the session data properly
    const sessionData = await getLatestSession(selectedTrack); // Await the result of getLatestSession
    const sessionKey = sessionData.session_key; // Access the session key
    console.log('Session Key:', sessionKey);

    const response = await axios.get('http://localhost:3000/api/laps', {
      params: {
        driverNumber,
        lapNumber,
        sessionKey,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lap data for driver ${driverNumber}:`, error);
    throw error;
  }
};

export const getDriverInfo = async (driverNumber) => {
  try {
      const sessionData = await getLatestSession(); // Await the result of getLatestSession
      const sessionKey = sessionData.session_key; // Access the session key
      console.log('Session Key:', sessionKey);
      const response = await axios.get(`${API_URL}/drivers`, {
          params: {
              driver_number: driverNumber,  // Passing driver_number to the API
              session_key: sessionKey  // You can dynamically fetch session_key if needed
          },
      });

      console.log(response.data);
      return response.data;  // Returns driver info like name, headshot URL, etc.
  } catch (error) {
      console.error("Error fetching driver info:", error);
      throw error;
  }
};