import React from 'react';
import { Settings, Download } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const SettingsDropdown = () => {
  const { 
    darkMode, 
    setDarkMode, 
    currency, 
    setCurrency, 
    showSettings, 
    setShowSettings,
    setShowExportModal,
    setShowAccountSettings
  } = useApp();
  
  return (
    <div className="relative settings-dropdown">
      <Settings 
        className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-pointer hover:text-blue-600`} 
        onClick={() => setShowSettings(!showSettings)}
      />
      {showSettings && (
        <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg z-50`}>
          <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h3>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md`}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dark Mode
                </label>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'} rounded-full bg-white`}
                  />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <button
                onClick={() => {
                  setShowExportModal(true);
                  setShowSettings(false);
                }}
                className={`w-full p-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm flex items-center justify-center`}
              >
                <Download size={16} className="mr-2" />
                Export Data
              </button>
            </div>
            
            <div className="mb-2">
              <button
                onClick={() => {
                  setShowAccountSettings(true);
                  setShowSettings(false);
                }}
                className={`w-full p-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm`}
              >
                Account Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;