import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { getMoneyTips } from '../../utils/moneyTips';

const TipsTab = () => {
  const { activeTrip, darkMode, expenseCategories } = useApp();
  const tips = getMoneyTips(activeTrip, expenseCategories);
  const highestSpendingCategory = tips.category;

  return (
    <div>
      <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
        Travel Money Saving Tips
      </h2>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-6`}>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
          Tips for <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {highestSpendingCategory}
          </span> (Your Highest Expense)
        </h3>
        <ul className="space-y-2">
          {tips.tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span
                className={`${darkMode ? 'text-green-400' : 'text-green-500'} mr-2`}
                role="img"
                aria-label="money bag"
              >
                💰
              </span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
            General Travel Savings
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>1.</span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Travel during shoulder season for better deals
              </span>
            </li>
            <li className="flex items-start">
              <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>2.</span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Use credit cards with no foreign transaction fees
              </span>
            </li>
            <li className="flex items-start">
              <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>3.</span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Book flights 2-3 months in advance
              </span>
            </li>
          </ul>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
            Destination-Specific Advice
          </h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            Based on your spending pattern:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>•</span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Look for city passes that include multiple attractions
              </span>
            </li>
            <li className="flex items-start">
              <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>•</span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Research local happy hours and dining specials
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TipsTab;