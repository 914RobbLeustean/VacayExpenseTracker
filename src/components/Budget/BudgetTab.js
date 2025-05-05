import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useBudget } from '../../hooks/useBudget';
import BudgetEditor from './BudgetEditor';
import BudgetDisplay from './BudgetDisplay';

const BudgetTab = () => {
  const { activeTrip, darkMode } = useApp();
  const { editingBudget, setEditingBudget, updateBudget } = useBudget();

  if (!activeTrip) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 text-center`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
          No active trip selected
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Select a trip to manage your budget
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Budget Settings
        </h2>
        {activeTrip.status === 'open' && (
          <button
            className={`${editingBudget ? 'bg-green-600' : 'bg-blue-600'} text-white px-4 py-2 rounded-lg hover:${editingBudget ? 'bg-green-700' : 'bg-blue-700'}`}
            onClick={() => editingBudget ? updateBudget(activeTrip.budget) : setEditingBudget(true)}
          >
            {editingBudget ? 'Save Budget' : 'Edit Budget'}
          </button>
        )}
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        {editingBudget ? (
          <BudgetEditor onCancel={() => setEditingBudget(false)} />
        ) : (
          <BudgetDisplay />
        )}
      </div>
    </div>
  );
};

export default BudgetTab;