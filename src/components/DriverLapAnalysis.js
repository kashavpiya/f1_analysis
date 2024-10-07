import React, { useEffect, useState } from 'react';
import { getDriverLapData } from '../services/api';

const DriverLapAnalysis = ({ driverNumber} ) => {
    const [lapData, setLapData] = useState(null); // Changed to null to indicate no data initially
    const [loading, setLoading] = useState(true);

    const fetchLapData = async () => {
        try {
            // Fetch lap data for lap 1 only
            const lapNumber = 1;
            const result = await getDriverLapData(1, lapNumber);
            
            // Check if the result is defined and has data
            if (result && result.length > 0) {
                const lap = result[0]; // Assuming result is an array and taking the first item
                const relevantLapData = {
                    lap_number: lap.lap_number || 0, // Lap number
                    lap_duration: lap.lap_duration || 0, // Lap duration
                    duration_sector_1: lap.duration_sector_1 || 0, // Sector 1 duration
                    duration_sector_2: lap.duration_sector_2 || 0, // Sector 2 duration
                    duration_sector_3: lap.duration_sector_3 || 0, // Sector 3 duration
                };
                setLapData(relevantLapData);
            } else {
                console.error('No data found for lap 1');
            }
        } catch (error) {
            console.error('Error fetching lap data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLapData();
    }, [driverNumber]);

    return (
        <div>
            {loading ? (
                <p>Loading lap data...</p>
            ) : lapData ? (
                <div>
                    <h2>Lap {lapData.lap_number}</h2>
                    <p>Lap Duration: {lapData.lap_duration}s</p>
                    <p>Sector 1 Duration: {lapData.duration_sector_1}s</p>
                    <p>Sector 2 Duration: {lapData.duration_sector_2}s</p>
                    <p>Sector 3 Duration: {lapData.duration_sector_3}s</p>
                </div>
            ) : (
                <p>No lap data available.</p>
            )}
        </div>
    );
};

export default DriverLapAnalysis;
