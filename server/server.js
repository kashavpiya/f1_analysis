const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5001;

// Use CORS middleware to allow requests from localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

const API_URL = "https://api.openf1.org";

// Fetch the most recent race
app.get('/api/latest-race', async (req, res) => {
  try {
    const racesResponse = await axios.get(`${API_URL}/races?limit=1&sort=-date`);
    const latestRace = racesResponse.data[0];
    res.json(latestRace);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching latest race' });
  }
});

// Fetch lap data for the latest race and a specific driver
app.get('/api/latest-race/driver/:driverId', async (req, res) => {
  const { driverId } = req.params;
  try {
    const racesResponse = await axios.get(`${API_URL}/races?limit=1&sort=-date`);
    const latestRaceId = racesResponse.data[0].id;

    const lapsResponse = await axios.get(`${API_URL}/races/${latestRaceId}/laps?driver=${driverId}`);
    res.json(lapsResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lap data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
