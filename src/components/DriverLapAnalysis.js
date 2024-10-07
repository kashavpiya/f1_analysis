import React, { useEffect, useState } from 'react';
import { getDriverLapData } from '../services/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './DriverLapAnalysis.css';
import Loader from './Loader'; // Assuming you create a loader component

const DriverLapAnalysis = () => {
    const [lapData, setLapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentLap, setCurrentLap] = useState(2);
    const [error, setError] = useState(null);

    const [lapDataNorris, setLapDataNorris] = useState(null);
    const [loadingNorris, setLoadingNorris] = useState(true);
    const [errorNorris, setErrorNorris] = useState(null);

    const fetchLapData = async (driverId, setLapData, setLoading, setError) => {
        try {
            const result = await getDriverLapData(driverId, currentLap);
            if (result && result.length > 0) {
                const lap = result[0];
                const relevantLapData = {
                    lap_number: lap.lap_number || 0,
                    lap_duration: lap.lap_duration || 0,
                    duration_sector_1: lap.duration_sector_1 || 0,
                    duration_sector_2: lap.duration_sector_2 || 0,
                    duration_sector_3: lap.duration_sector_3 || 0,
                };
                setLapData(relevantLapData);
            } else {
                throw new Error('No data found for the lap');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setLoadingNorris(true);
        setError(null);
        setErrorNorris(null);
        
        fetchLapData(1, setLapData, setLoading, setError);
        fetchLapData(4, setLapDataNorris, setLoadingNorris, setErrorNorris);
    }, [currentLap]);

    const chartData = (data, label) => ({
        labels: ['Sector 1', 'Sector 2', 'Sector 3'],
        datasets: [
            {
                label: `${label} Lap ${data?.lap_number - 1 || 0} Duration (s)`,
                data: [
                    data?.duration_sector_1 || 0,
                    data?.duration_sector_2 || 0,
                    data?.duration_sector_3 || 0,
                ],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
            },
        ],
    });

    const handleLapChange = (increment) => {
        setCurrentLap((prevLap) => Math.max(prevLap + increment, 1));
    };

    return (
        <div className="driver-lap-analysis">
            <div className="lap-comparison">
                <div className="driver-section">
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <p>{error}</p>
                    ) : lapData ? (
                        <LapDataDisplay label="Max Verstappen" lapData={lapData} chartData={chartData(lapData, "Max Verstappen")} />
                    ) : (
                        <p>No lap data available.</p>
                    )}
                </div>
                <div className="driver-section">
                    {loadingNorris ? (
                        <Loader />
                    ) : errorNorris ? (
                        <p>{errorNorris}</p>
                    ) : lapDataNorris ? (
                        <LapDataDisplay label="Lando Norris" lapData={lapDataNorris} chartData={chartData(lapDataNorris, "Lando Norris")} />
                    ) : (
                        <p>No lap data available.</p>
                    )}
                </div>
            </div>
            <div className="lap-navigation">
                <button onClick={() => handleLapChange(-1)} disabled={currentLap <= 1}>
                    Previous Lap
                </button>
                <button onClick={() => handleLapChange(1)} style={{ marginLeft: '10px' }}>
                    Next Lap
                </button>
            </div>
        </div>
    );
};

const LapDataDisplay = ({ label, lapData, chartData }) => (
    <div>
        <h2>Lap {lapData.lap_number - 1}</h2>
        <p>{label}</p>
        <p>Total Lap Duration: {lapData.lap_duration}s</p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Bar
                data={chartData}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Duration (s)',
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}s`,
                            },
                        },
                    },
                }}
            />
        </div>
    </div>
);

export default DriverLapAnalysis;
