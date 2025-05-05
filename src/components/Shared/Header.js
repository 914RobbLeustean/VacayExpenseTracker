import React from 'react';
import { DollarSign } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import TripSelector from '../Trips/TripSelector';
import Notifications from './Notifications';
import SettingsDropdown from './Settings';

const Header = () => {
  const { darkMode } = useApp();
  
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`ml-2 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>VacayTracker</h1>
          </div>
          <div className="flex items-center space-x-8">
            {/* Trip selector component */}
            <TripSelector />
            
            {/* Notifications component */}
            <Notifications />
            
            {/* Settings component */}
            <SettingsDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;