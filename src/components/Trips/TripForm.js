import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTrips } from '../../hooks/useTrips';

const TripForm = () => {
  const { darkMode, showNewTripForm, setShowNewTripForm } = useApp();
  const { createTrip } = useTrips();
  const [tripData, setTripData] = useState({
    name: '',
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!tripData.name || !tripData.destination) {
      return;
    }

    createTrip(tripData);
    setShowNewTripForm(false);
    setTripData({
      name: '',
      destination: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
  };

  if (!showNewTripForm) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Create New Trip
          </h2>
          <button 
            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setShowNewTripForm(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Trip Name
              </label>
              <input
                type="text"
                value={tripData.name}
                onChange={(e) => setTripData({...tripData, name: e.target.value})}
                className={`w-full p-2 border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., Summer Vacation"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Destination
              </label>
              <input
                type="text"
                value={tripData.destination}
                onChange={(e) => setTripData({...tripData, destination: e.target.value})}
                className={`w-full p-2 border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., Paris, France"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={tripData.startDate}
                  onChange={(e) => setTripData({...tripData, startDate: e.target.value})}
                  className={`w-full p-2 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  End Date
                </label>
                <input
                  type="date"
                  value={tripData.endDate}
                  onChange={(e) => setTripData({...tripData, endDate: e.target.value})}
                  className={`w-full p-2 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className={`mr-2 px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                darkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
              onClick={() => setShowNewTripForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;