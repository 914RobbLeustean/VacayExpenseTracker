import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import ExpenseTable from './ExpenseTable';

const ExpensesTab = () => {
  const { activeTrip, darkMode, setShowNewExpenseForm } = useApp();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Recent Expenses
        </h2>
        {activeTrip?.status === 'open' && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
            onClick={() => setShowNewExpenseForm(true)}
          >
            <Plus size={16} className="mr-1" />
            Add Expense
          </button>
        )}
      </div>
      
      {!activeTrip || activeTrip.expenses?.length === 0 ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 text-center`}>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {!activeTrip ? "No active trip selected" : "No expenses recorded yet"}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            {!activeTrip ? "Select a trip to view expenses" : "Click the \"Add Expense\" button to get started"}
          </p>
        </div>
      ) : (
        <ExpenseTable expenses={activeTrip.expenses} />
      )}
    </div>
  );
};

export default ExpensesTab;