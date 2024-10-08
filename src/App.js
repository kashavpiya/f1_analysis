import React from 'react';
import DriverLapAnalysis from './components/DriverLapAnalysis';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1 className='title'>F1 Lap by Lap</h1>
      <DriverLapAnalysis/>
    </div>
  );
};

export default App;
