import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONSTANTS } from '../utils/constants';
import { DEFAULT_EXPENSE_CATEGORIES } from '../data/defaultData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState(CONSTANTS.DEFAULT_CURRENCY);
  const [expenseCategories, setExpenseCategories] = useState(DEFAULT_EXPENSE_CATEGORIES);
  const [notification, setNotification] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to VacayTracker! Create a trip to start logging expenses.", read: false, date: "Apr 23" }
  ]);

  // Add these missing states
  const [showNewExpenseForm, setShowNewExpenseForm] = useState(false);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [showTripSelector, setShowTripSelector] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [exportOptions, setExportOptions] = useState({
    format: 'pdf',
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    },
    categories: DEFAULT_EXPENSE_CATEGORIES.map(cat => cat.id),
    pdfOptions: {
      includeBudget: true,
      includeCharts: true,
      includeCategoryBreakdown: true
    },
    filename: `VacayTracker_${new Date().toISOString().slice(0, 7)}`
  });

  // Load trips from localStorage
  useEffect(() => {
    const savedTrips = localStorage.getItem('vacayTrackerTrips');
    if (savedTrips) {
      const parsedTrips = JSON.parse(savedTrips);
      setTrips(parsedTrips);
      const openTrip = parsedTrips.find(trip => trip.status === 'open');
      if (openTrip) {
        setActiveTrip(openTrip);
      }
    }
  }, []);

  // Save trips to localStorage whenever they change
  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem('vacayTrackerTrips', JSON.stringify(trips));
    }
  }, [trips]);

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      trips,
      setTrips,
      activeTrip,
      setActiveTrip,
      expenses,
      setExpenses,
      darkMode,
      setDarkMode,
      currency,
      setCurrency,
      expenseCategories,
      setExpenseCategories,
      notification,
      setNotification,
      notifications,
      setNotifications,
      // Add these to the context value
      showNewExpenseForm,
      setShowNewExpenseForm,
      showNewTripForm,
      setShowNewTripForm,
      showTripSelector,
      setShowTripSelector,
      showExportModal,
      setShowExportModal,
      showAccountSettings,
      setShowAccountSettings,
      showSettings,
      setShowSettings,
      showNotifications,
      setShowNotifications,
      exportOptions,
      setExportOptions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};