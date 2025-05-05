import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useBudget } from '../../hooks/useBudget';
import { getCurrencySymbol } from '../../utils/currency';

const BudgetEditor = ({ onCancel }) => {
  const { activeTrip, darkMode, currency, expenseCategories } = useApp();
  const { updateBudget } = useBudget();
  const [budget, setBudget] = useState({});
  const currSymbol = getCurrencySymbol(currency);

  useEffect(() => {
    if (activeTrip?.budget) {
      setBudget(activeTrip.budget);
    }
  }, [activeTrip]);

  const handleSave = () => {
    updateBudget(budget);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenseCategories.map((category) => (
          <div key={category.id} className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              {category.name}
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} sm:text-sm`}>
                  {currSymbol}
                </span>
              </div>
              <input
                type="number"
                min="0"
                value={budget[category.id] || 0}
                onChange={(e) => setBudget({...budget, [category.id]: parseFloat(e.target.value) || 0})}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                } rounded-md`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className={`mr-2 px-4 py-2 border ${
            darkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          } rounded-md shadow-sm text-sm font-medium`}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default BudgetEditor;