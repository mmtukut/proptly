import React from 'react';
import { useLocation } from 'react-router-dom';

const MapLayout = ({ children }) => {
  const location = useLocation();
  const isMapView = location.pathname === '/map';

  return (
    <div className={`${isMapView ? 'h-screen w-screen' : ''}`}>
      {children}
    </div>
  );
};

export default MapLayout; 