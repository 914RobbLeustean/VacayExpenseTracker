import React from 'react';
import { useApp } from '../../contexts/AppContext';

const Layout = ({ children }) => {
  const { darkMode } = useApp();
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {children}
    </div>
  );
};

export default Layout;