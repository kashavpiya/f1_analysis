import React from 'react';
import './Loader.css'; // Import your styles for the loader

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loader;
