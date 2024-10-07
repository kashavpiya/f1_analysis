import React, { useState, useEffect } from 'react';
import { getLatestRace, getDriverLapData } from '../services/api';
import Chart from 'chart.js/auto';

const DriverLapAnalysis = ({ driverId }) => {
  const [lapData, setLapData] = useState(null);
  const [latestRace, setLatestRace] = useState(null);

  useEffect(() => {
    const fetchLatestRace = async () => {
      const race = await getLatestRace();
      setLatestRace(race);
      const data = await getDriverLapData(driverId);
      setLapData(data);
    };
    fetchLatestRace();
  }, [driverId]);

  const plotGraph = (data) => {
    const ctx = document.getElementById('lapChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((lap) => lap.lapNumber),
        datasets: [{
          label: 'Speed (km/h)',
          data: data.map((lap) => lap.speed),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        }]
      }
    });
  };

  useEffect(() => {
    if (lapData) plotGraph(lapData);
  }, [lapData]);

  return (
    <div>
      {latestRace ? (
        <h2>Latest Race: {latestRace.name}</h2>
      ) : (
        <p>Loading latest race...</p>
      )}
      <canvas id="lapChart"></canvas>
    </div>
  );
};

export default DriverLapAnalysis;
