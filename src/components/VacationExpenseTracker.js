import React from 'react';
import { AppProvider } from '../contexts/AppContext';
import Layout from './Shared/Layout';
import Header from './Shared/Header';
import Dashboard from './Dashboard/Dashboard';
import ExpensesTab from './Expenses/ExpensesTab';
import BudgetTab from './Budget/BudgetTab';
import TipsTab from './Tips/TipsTab';
import ExpenseForm from './Expenses/ExpenseForm';
import TripManager from './Trips/TripManager';
import ExportModal from './Export/ExportModal';
import AccountSettings from './AccountSettings';
import { useApp } from '../contexts/AppContext';

const VacationTrackerContent = () => {
  const { activeTab, showAccountSettings, darkMode, setShowAccountSettings } = useApp();

  return (
    <Layout>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex border-b mb-4">
          <TabButton tab="dashboard" label="Dashboard" />
          <TabButton tab="expenses" label="Expenses" />
          <TabButton tab="budget" label="Budget" />
          <TabButton tab="tips" label="Travel Tips" />
        </div>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'expenses' && <ExpensesTab />}
        {activeTab === 'budget' && <BudgetTab />}
        {activeTab === 'tips' && <TipsTab />}

        <ExpenseForm />
        <TripManager />
        <ExportModal />
      </main>

      {showAccountSettings && (
        <AccountSettings
          onClose={() => setShowAccountSettings(false)}
          darkMode={darkMode}
        />
      )}
    </Layout>
  );
};

const TabButton = ({ tab, label }) => {
  const { activeTab, setActiveTab, activeTrip, darkMode } = useApp();
  const isDisabled = (tab === 'expenses' || tab === 'budget') && !activeTrip;

  return (
    <button
      className={`px-4 py-2 mr-2 font-medium ${
        activeTab === tab 
          ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') 
          : (darkMode ? 'text-gray-400' : 'text-gray-500')
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !isDisabled && setActiveTab(tab)}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

const VacationExpenseTracker = () => {
  return (
    <AppProvider>
      <VacationTrackerContent />
    </AppProvider>
  );
};

export default VacationExpenseTracker;