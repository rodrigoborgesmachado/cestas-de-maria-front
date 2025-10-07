import React from 'react';
import './LoadingModal.css';
import PacmanLoader from './../PacmanLoader/PacmanLoader';

const LoadingModal = () => {
  return (
    <div className="loading-backdrop super-z-index">
      <div className="loading-modal">
        {/* <div className="spinner"></div> */}
        <PacmanLoader/>
      </div>
    </div>
  );
};

export default LoadingModal;
