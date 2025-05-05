import React from 'react';
import { Map } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const TripSelector = () => {
  const { activeTrip, darkMode, setShowTripSelector } = useApp();
  
  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowTripSelector(true);
        }}
        className={`flex items-center px-3 py-2 rounded-lg ${
          activeTrip 
            ? 'bg-blue-100 text-blue-700' 
            : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}
      >
        <Map size={16} className="mr-2" />
        {activeTrip ? <span>{activeTrip.name}</span> : <span>Select Trip</span>}
      </button>
    </div>
  );
};

export default TripSelector;