import React from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTrips } from '../../hooks/useTrips';

const TripCard = ({ trip }) => {
  const { darkMode } = useApp();
  const { closeTrip, reopenTrip } = useTrips();
  
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow mb-6`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {trip.name}
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            <MapPin size={16} className="inline mr-1" />
            {trip.destination}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          {trip.status === 'open' ? (
            <button
              onClick={() => closeTrip(trip.id)}
              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
            >
              Close Trip
            </button>
          ) : (
            <button
              onClick={() => reopenTrip(trip.id)}
              className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
            >
              Reopen Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;