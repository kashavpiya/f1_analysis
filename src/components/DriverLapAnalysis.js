import React, { useEffect, useState } from 'react';
import { getDriverLapData } from '../services/api';
import { Bar } from 'react-chartjs-2'; // Import the Bar chart
import 'chart.js/auto'; // Import the necessary Chart.js component

const DriverLapAnalysis = ({ driverNumber }) => {
    const [lapData, setLapData] = useState(null); // Data state
    const [loading, setLoading] = useState(true); // Loading state
    const [currentLap, setCurrentLap] = useState(2); // Current lap state

    const [lapDataNorris, setLapDataNorris] = useState(null);
    const [loadingNorris, setLoadingNorris] = useState(true); // Loading state
    const fetchLapData = async (lapNumber) => {
        try {
            const result = await getDriverLapData(1, lapNumber);
            
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
                console.error('No data found for the lap');
            }
        } catch (error) {
            console.error('Error fetching lap data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLapData(currentLap);
    }, [currentLap, driverNumber]);

    // Chart Data
    const chartData = {
        labels: ['Sector 1', 'Sector 2', 'Sector 3'],
        datasets: [
            {
                label: `Lap ${lapData?.lap_number - 1 || 0} Duration (s)`,
                data: [
                    lapData?.duration_sector_1 || 0,
                    lapData?.duration_sector_2 || 0,
                    lapData?.duration_sector_3 || 0,
                ],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'], // Colors for the bars
            },
        ],
    };


    const fetchLapDataNorris = async (lapNumber) => {
        try {
            const result = await getDriverLapData(4, lapNumber);
            
            if (result && result.length > 0) {
                const lap = result[0];
                const relevantLapData = {
                    lap_number: lap.lap_number || 0,
                    lap_duration: lap.lap_duration || 0,
                    duration_sector_1: lap.duration_sector_1 || 0,
                    duration_sector_2: lap.duration_sector_2 || 0,
                    duration_sector_3: lap.duration_sector_3 || 0,
                };
                setLapDataNorris(relevantLapData);
            } else {
                console.error('No data found for the lap');
            }
        } catch (error) {
            console.error('Error fetching lap data:', error);
        } finally {
            setLoadingNorris(false);
        }
    };

    useEffect(() => {
        fetchLapDataNorris(currentLap);
    }, [currentLap, driverNumber]);

    // Chart Data
    const chartDataNorris = {
        labels: ['Sector 1', 'Sector 2', 'Sector 3'],
        datasets: [
            {
                label: `Lap ${lapData?.lap_number - 1 || 0} Duration (s)`,
                data: [
                    lapData?.duration_sector_1 || 0,
                    lapData?.duration_sector_2 || 0,
                    lapData?.duration_sector_3 || 0,
                ],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'], // Colors for the bars
            },
        ],
    };


    // Handlers for Previous and Next Lap buttons
    const handlePreviousLap = () => {
        setCurrentLap((prevLap) => Math.max(prevLap - 1, 1)); // Ensure lap number doesn't go below 1
    };

    const handleNextLap = () => {
        setCurrentLap((prevLap) => prevLap + 1); // Increment lap number
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <div>
            {loading ? (
                <p>Loading lap data...</p>
            ) : lapData ? (
                <div>
                    <h2>Lap {lapData.lap_number - 1} Analysis</h2>
                    <p>Max Verstappen</p>
                    <p>Total Lap Duration: {lapData.lap_duration}s</p>

                    {/* Bar Chart */}
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
                            }}
                        />
                    </div>
                    
                </div>
            ) : (
                <p>No lap data available.</p>
            )}
            {loadingNorris ? (
                <p>Loading lap data...</p>
            ) : lapDataNorris ? (
                <div>
                    <p>Lando Norris</p>
                    <p>Total Lap Duration: {lapDataNorris.lap_duration}s</p>

                    {/* Bar Chart */}
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Bar
                            data={chartDataNorris}
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
                            }}
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={handlePreviousLap} disabled={currentLap <= 1}>
                            Previous Lap
                        </button>
                        <button onClick={handleNextLap} style={{ marginLeft: '10px' }}>
                            Next Lap
                        </button>
                    </div>
                </div>
            ) : (
                <p>No lap data available.</p>
            )}
            </div>
        </div>
    );
};

export default DriverLapAnalysis;
