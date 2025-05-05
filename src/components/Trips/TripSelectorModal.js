import React from 'react';
import { Plus, X, MapPin, Lock, Unlock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTrips } from '../../hooks/useTrips';

const TripSelectorModal = () => {
  const { 
    darkMode, 
    showTripSelector, 
    setShowTripSelector, 
    trips, 
    activeTrip,
    setShowNewTripForm 
  } = useApp();
  const { setActiveTrip } = useTrips();

  const handleSelect = (trip) => {
    setActiveTrip(trip);
    setShowTripSelector(false);
  };

  const openNewTripForm = () => {
    setShowTripSelector(false);
    setShowNewTripForm(true);
  };

  if (!showTripSelector) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Select Trip
          </h2>
          <button 
            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setShowTripSelector(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {trips.map(trip => (
            <div 
              key={trip.id}
              className={`p-3 rounded-lg cursor-pointer border-2 ${
                activeTrip?.id === trip.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
              }`}
              onClick={() => handleSelect(trip)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {trip.name}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MapPin size={14} className="inline mr-1" />
                    {trip.destination}
                  </p>
                </div>
                <div className="flex items-center">
                  {trip.status === 'closed' ? (
                    <Lock size={16} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  ) : (
                    <Unlock size={16} className={`${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700"
          onClick={openNewTripForm}
        >
          <Plus size={16} className="mr-1" />
          Create New Trip
        </button>
      </div>
    </div>
  );
};

export default TripSelectorModal;