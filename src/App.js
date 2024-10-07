import React from 'react';
import DriverLapAnalysis from './components/DriverLapAnalysis';
import './App.css';

const App = () => {
  const driverId = 'driverIdExample'; // Replace with actual driver ID

  return (
    <div className="App">
      <h1>F1 Driver Lap Analysis</h1>
      <DriverLapAnalysis driverId={driverId} />
    </div>
  );
};

export default App;
