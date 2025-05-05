import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { getTotalBudget, calculateCategoryTotal } from '../../utils/calculations';
import { getCurrencySymbol } from '../../utils/currency';
import { CONSTANTS } from '../../utils/constants';

const BudgetDisplay = () => {
  const { activeTrip, darkMode, currency, expenseCategories } = useApp();
  const currSymbol = getCurrencySymbol(currency);
  const totalBudget = getTotalBudget(activeTrip);

  return (
    <div>
      <div className="mb-6">
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Total Budget: {currSymbol}{totalBudget.toFixed(2)}
        </h3>

        {totalBudget === 0 ? (
          <div className="text-center py-4">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
              No budget set
            </p>
            {activeTrip.status === 'open' && (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Click "Edit Budget" to set up your spending limits
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              Allocation by category:
            </p>

            {expenseCategories.map((category) => {
              const spent = calculateCategoryTotal(category.id, activeTrip);
              const budgetAmount = activeTrip.budget[category.id] || 0;
              const percentUsed = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

              return (
                <div key={category.id} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <div>
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {category.name}
                      </span>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currSymbol}{spent.toFixed(2)} of {currSymbol}{budgetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                    <div 
                      className={`h-2 rounded-full ${
                        percentUsed > CONSTANTS.BUDGET_DANGER_THRESHOLD ? 'bg-red-500' : 
                        percentUsed > CONSTANTS.BUDGET_WARNING_THRESHOLD ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg`}>
        <h3 className={`text-md font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'} mb-2`}>
          Budget Tips
        </h3>
        <ul className={`list-disc pl-5 text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
          <li className="mb-1">
            Set realistic budgets for each category based on destination costs
          </li>
          <li className="mb-1">
            Allow for a 10-15% buffer in your total budget for unexpected expenses
          </li>
          <li className="mb-1">
            Review your spending patterns regularly and adjust budgets as needed
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetDisplay;