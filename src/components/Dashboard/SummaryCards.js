import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { getExpenseSummary } from '../../utils/calculations';
import { getCurrencySymbol } from '../../utils/currency';
import { CONSTANTS } from '../../utils/constants';

const SummaryCards = () => {
  const { activeTrip, darkMode, currency, setActiveTab } = useApp();
  const summary = getExpenseSummary(activeTrip);
  const currSymbol = getCurrencySymbol(currency);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Total Spent
        </h3>
        <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {currSymbol}{summary.totalExpenses.toFixed(2)}
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          of {currSymbol}{summary.totalBudget.toFixed(2)} budget
        </p>
        <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 mt-2`}>
          <div 
            className={`h-2.5 rounded-full ${
              summary.percentUsed > CONSTANTS.BUDGET_DANGER_THRESHOLD ? 'bg-red-500' : 
              summary.percentUsed > CONSTANTS.BUDGET_WARNING_THRESHOLD ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(summary.percentUsed, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Remaining Budget
        </h3>
        <p className={`text-2xl font-bold ${
          summary.remaining >= 0 ? 
            (darkMode ? 'text-green-400' : 'text-green-600') : 
            (darkMode ? 'text-red-400' : 'text-red-600')
        }`}>
          {currSymbol}{summary.remaining.toFixed(2)}
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {summary.remaining >= 0 ? 'Still available to spend' : 'Over budget'}
        </p>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Recent Activity
        </h3>
        {activeTrip.expenses?.length > 0 ? (
          <div>
            {activeTrip.expenses.slice(-1).map(expense => (
              <div key={expense.id} className="mb-2">
                <p className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                  {expense.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {expense.date}
                  </span>
                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                    {currSymbol}{expense.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            <p 
              className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-500'} cursor-pointer mt-2`} 
              onClick={() => setActiveTab('expenses')}
            >
              View all expenses →
            </p>
          </div>
        ) : (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No expenses recorded yet
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCards;