import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Spinner = () => (
  <div className="spinner-container d-flex justify-content-center align-items-center" style={{
    height:"20px",
    width:"20px"
  }}>
    <FiLoader className="spinner-icon" />
  </div>
);

export default Spinner;
