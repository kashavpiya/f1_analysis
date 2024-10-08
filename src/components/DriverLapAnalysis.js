import React, { useEffect, useState } from 'react';
import { getDriverLapData, getDriverInfo } from '../services/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './DriverLapAnalysis.css';
import Loader from './Loader'; // Assuming you create a loader component
import ChartDataLabels from 'chartjs-plugin-datalabels';

const tracks = [
    { country_name: 'Singapore', track_name: "Singapore"},
    { country_name: 'Azerbaijan', track_name: 'Baku'},
    { country_name: 'Netherlands', track_name: 'Zandvoort'},
    { country_name: 'Belgium', track_name: 'Belgium'},
    { country_name: 'Hungary', track_name: 'Hungary'},
];
const drivers = [
    { id: 1, name: "Max Verstappen", img: require('../assets/maxver01.png') },
    { id: 11, name: "Sergio Perez", img: require('../assets/serper01.png')},
    { id: 4, name: "Lando Norris" , img: require('../assets/lannor01.png')},
    { id: 81, name: "Oscar Piastri", img: require('../assets/oscpia01.png')},
    { id: 44, name: "Lewis Hamilton" , img: require('../assets/lewham01.png')},
    { id: 63, name: "George Russell", img: require('../assets/georus01.png') },
    { id: 16, name: "Charles Leclerc", img: require('../assets/chalec01.png') },
    { id: 55, name: "Carlos Sainz Jr", img: require('../assets/carsai01.png') },
    { id: 14, name: "Fernando Alonso" , img: require('../assets/feralo01.png')},
    { id: 18, name: "Lance Stroll", img: require('../assets/lanstr01.png') },
    { id: 23, name: "Alex Albon", img: require('../assets/alealb01.png') },
    { id: 43, name: "Franco Colapinto", img: require('../assets/fracol01.png') },
    { id: 3, name: "Daniel Ricciardo", img: require('../assets/danric01.png') },
    { id: 22, name: "Yuki Tsunoda", img: require('../assets/yuktsu01.png') },
    { id: 24, name: "Guanyu Zhou", img: require('../assets/guazho01.png') },
    { id: 77, name: "Valtteri Bottas", img: require('../assets/valbot01.png') },
    { id: 20, name: "Kevin Magnussen", img: require('../assets/kevmag01.png') },
    { id: 27, name: "Nico Hülkenberg", img: require('../assets/nichul01.png') },
    { id: 10, name: "Pierre Gasly", img: require('../assets/piegas01.png') },
    { id: 31, name: "Esteban Ocon", img: require('../assets/estoco01.png') },
    { id: 2, name: "Logan Sargeant", img: require('../assets/logsar01.png') },
    { id: 87, name: "Oliver Bearman", img: require('../assets/olibea01.png') },
    
];

const DriverLapAnalysis = () => {
    const [lapDataDriver1, setLapDataDriver1] = useState(null);
    const [loadingDriver1, setLoadingDriver1] = useState(true);
    const [errorDriver1, setErrorDriver1] = useState(null);


    const [lapDataDriver2, setLapDataDriver2] = useState(null);
    const [loadingDriver2, setLoadingDriver2] = useState(true);
    const [errorDriver2, setErrorDriver2] = useState(null);
    const [loadingTrack, setLoadingTrack] = useState(true);

    const [currentLap, setCurrentLap] = useState(2);
    const [selectedDriver1, setSelectedDriver1] = useState(drivers[0].id);
    const [selectedDriver2, setSelectedDriver2] = useState(drivers[1].id);
    const [selectedTrack, setSelectedTrack] = useState(tracks[0].country_name);
    // Fetch lap data for the selected driver
    const fetchLapData = async (driverId, setLapData, setLoading, setError, selectedTrack) => {
        try {
            const result = await getDriverLapData(driverId, currentLap, selectedTrack);
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
                throw new Error('No Lap Data Found');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoadingDriver1(true);
        setLoadingDriver2(true);
        setErrorDriver1(null);
        setErrorDriver2(null);
        setLoadingTrack(true);
        
        fetchLapData(selectedDriver1, setLapDataDriver1, setLoadingDriver1, setErrorDriver1, selectedTrack);
        fetchLapData(selectedDriver2, setLapDataDriver2, setLoadingDriver2, setErrorDriver2, selectedTrack);
    }, [currentLap, selectedDriver1, selectedDriver2, selectedTrack]);

    // Chart data for displaying lap durations
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

    // Handle lap navigation
    const handleLapChange = (increment) => {
        setCurrentLap((prevLap) => Math.max(prevLap + increment, 1));
    };

    
    // Handle driver selection changes
    const handleDriver1Change = (event) => {
        setSelectedDriver1(Number(event.target.value));
    };

    const handleDriver2Change = (event) => {
        setSelectedDriver2(Number(event.target.value));
    };

    const handleTrackChange = (event) => {
        setSelectedTrack(event.target.value); 
    };

    const calculateComparison = () => {
        if (!lapDataDriver1 || !lapDataDriver2) return null;

        const comparison = {
            sector1: (lapDataDriver1.duration_sector_1 - lapDataDriver2.duration_sector_1).toFixed(3),
            sector2: (lapDataDriver1.duration_sector_2 - lapDataDriver2.duration_sector_2).toFixed(3),
            sector3: (lapDataDriver1.duration_sector_3 - lapDataDriver2.duration_sector_3).toFixed(3),
            total: (lapDataDriver1.lap_duration - lapDataDriver2.lap_duration).toFixed(3),
        };

        return comparison;
    };

    const comparison = calculateComparison();

    return (
        <div className="driver-lap-analysis">
            <div className='track-selection'>
                <label>Select GP: </label>
                <select value={selectedTrack} onChange={handleTrackChange} className="dropdown">
                    {tracks.map(track => (
                        <option key={track.track_name} value={track.country_name}>{track.track_name}</option>
                    ))}
                </select>
            </div>
             <div className="driver-selection">
                <label>Select Driver 1: </label>
                <select value={selectedDriver1} onChange={handleDriver1Change} className="dropdown">
                    {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>{driver.name}</option>
                    ))}
                </select>

                <label>Select Driver 2: </label>
                <select value={selectedDriver2} onChange={handleDriver2Change} className="dropdown">
                    {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>{driver.name}</option>
                    ))}
                </select>

            </div>

            <div className="lap-comparison">
                <div className="driver-section">
                    {loadingDriver1 ? (
                        <Loader />
                    ) : errorDriver1 ? (
                        <p>{errorDriver1}</p>
                    ) : lapDataDriver1 ? (
                        <LapDataDisplay
                            label={drivers.find(d => d.id === selectedDriver1).name}
                            lapData={lapDataDriver1}
                            chartData={chartData(lapDataDriver1, drivers.find(d => d.id === selectedDriver1).name)}
                            imgSrc={drivers.find(d => d.id === selectedDriver1).img}
                        />
                    ) : (
                        <p>No lap data available.</p>
                    )}
                </div>
                <div className="driver-section">
                    {loadingDriver2 ? (
                        <Loader />
                    ) : errorDriver2 ? (
                        <p>{errorDriver2}</p>
                    ) : lapDataDriver2 ? (
                        <LapDataDisplay
                            label={drivers.find(d => d.id === selectedDriver2).name}
                            lapData={lapDataDriver2}
                            chartData={chartData(lapDataDriver2, drivers.find(d => d.id === selectedDriver2).name)}
                            imgSrc={drivers.find(d => d.id === selectedDriver2).img}
                        />
                    ) : (
                        <p>No lap data available.</p>
                    )}
                </div>
            </div>

            {comparison && (
                <div className="comparison-summary">
                    <h3>Comparison Summary</h3>
                    <p className={comparison.sector1 > 0 ? "faster" : ""}>
                        Sector 1: {comparison.sector1 > 0 ? `Driver 2 faster by ${Math.abs(comparison.sector1)}s` : `Driver 1 faster by ${Math.abs(comparison.sector1)}s`}
                    </p>
                    <p className={comparison.sector2 > 0 ? "faster" : ""}>
                        Sector 2: {comparison.sector2 > 0 ? `Driver 2 faster by ${Math.abs(comparison.sector2)}s` : `Driver 1 faster by ${Math.abs(comparison.sector2)}s`}
                    </p>
                    <p className={comparison.sector3 > 0 ? "faster" : ""}>
                        Sector 3: {comparison.sector3 > 0 ? `Driver 2 faster by ${Math.abs(comparison.sector3)}s` : `Driver 1 faster by ${Math.abs(comparison.sector3)}s`}
                    </p>
                    <p className={comparison.total > 0 ? "faster" : ""}>
                        Total Lap: {comparison.total > 0 ? `Driver 2 faster by ${Math.abs(comparison.total)}s overall` : `Driver 1 faster by ${Math.abs(comparison.total)}s overall`}
                    </p>
                </div>
            )}


            <div className="lap-navigation">
                <button onClick={() => handleLapChange(-1)} disabled={currentLap-1 <= 1}>
                    Previous Lap
                </button>
                <button onClick={() => handleLapChange(1)} style={{ marginLeft: '10px' }}>
                    Next Lap
                </button>
            </div>
        </div>
    );
};

const LapDataDisplay = ({ label, lapData, chartData, imgSrc }) => (
    <div>
        <h2>Lap {lapData.lap_number - 1}</h2>
        <img src={imgSrc} alt={label} className="driver-headshot" />
        <p>{label}</p>
        <p>Total Lap Duration: {lapData.lap_duration}s</p>
        <div className="chart-container">
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: { enabled: false },
                        datalabels: {
                            color: 'white',
                            anchor: 'end',
                            align: 'end',
                            formatter: (value) => `${value}s`,
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Duration (s)' },
                        },
                    },
                }}
                plugins={[ChartDataLabels]}
            />
        </div>
    </div>
);

export default DriverLapAnalysis;