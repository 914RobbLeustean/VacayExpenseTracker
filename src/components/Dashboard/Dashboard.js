import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import TripCard from './TripCard';
import SummaryCards from './SummaryCards';
import Charts from './Charts';

const Dashboard = () => {
  const { activeTrip, darkMode, setShowNewTripForm, setShowNewExpenseForm } = useApp();

  if (!activeTrip) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-8 text-center`}>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Welcome to VacayTracker
        </h2>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
          Start by creating a trip to track your vacation expenses
        </p>
        <button
          onClick={() => setShowNewTripForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Create Your First Trip
        </button>
      </div>
    );
  }

  return (
    <div>
      <TripCard trip={activeTrip} />
      <SummaryCards />
      <Charts />
      
      {activeTrip?.status === 'open' && (
        <button
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
          onClick={() => setShowNewExpenseForm(true)}
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
};

export default Dashboard;