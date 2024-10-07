const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = 'https://api.openf1.org/v1'; // Correct base URL for OpenF1 API

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON (if needed)
app.use(express.json());

// Route to handle F1 driver lap data requests
app.get('/api/laps', async (req, res) => {
  try {
    const { driverNumber, lapNumber, sessionKey } = req.query;

    // Validate incoming query parameters
    if (!driverNumber || !lapNumber || !sessionKey) {
      return res.status(400).json({ error: 'Missing required parameters: driverNumber, lapNumber, or sessionKey' });
    }

    // Fetch lap data from the external F1 API
    const response = await axios.get(`${API_URL}/laps`, {
      params: {
        session_key: sessionKey,
        driver_number: driverNumber,
        lap_number: lapNumber,
      },
    });

    // Return the data to the frontend
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching lap data for driver ${req.query.driverNumber}:`, error.message);

    // Check if it's an Axios error and provide more detailed information
    if (error.response) {
      // The request was made and the server responded with a status code that is not in the range of 2xx
      res.status(error.response.status).json({
        error: 'Failed to fetch lap data',
        message: error.response.data || 'An error occurred',
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({
        error: 'No response received from the external API',
      });
    } else {
      // Something else happened while making the request
      res.status(500).json({
        error: 'An unexpected error occurred',
        message: error.message,
      });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
