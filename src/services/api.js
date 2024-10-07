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
      console.log(response);
      return response.data[0]; // Assuming the first result is the latest session
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
};

export const getDriverLapData = async (driverNumber, lapNumber) => {
    try {
        const latestSession = await getLatestSession(); // Get the latest session
        console.log(latestSession);
        const sessionKey = latestSession.session_key; 
        const response = await axios.get(`${API_URL}/laps`, {
            params: {
                session_key: sessionKey,
                driver_number: driverNumber, // Use the parameter here
                lap_number: lapNumber,
            },
        });
        console.log(response.data);
        return response.data; // Return lap data for the driver
    } catch (error) {
        console.error(`Error fetching lap data for driver ${driverNumber}:`, error);
        throw error; // Rethrow the error for handling in the component
    }
};