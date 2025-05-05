import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useExpenses } from '../../hooks/useExpenses';
import { getCurrencySymbol } from '../../utils/currency';
import { getCategoryInfo } from '../../utils/categoryHelpers';

const ExpenseTable = ({ expenses }) => {
  const { activeTrip, darkMode, currency, expenseCategories } = useApp();
  const { deleteExpense, setEditingExpense, setShowNewExpenseForm } = useExpenses();
  const currSymbol = getCurrencySymbol(currency);
  
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowNewExpenseForm(true);
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Date
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Description
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Category
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Amount
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {expenses.map((expense) => (
              <tr key={expense.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {expense.date}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {expense.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: darkMode ? 
                        `${getCategoryInfo(expense.category, expenseCategories, 'color')}30` : 
                        `${getCategoryInfo(expense.category, expenseCategories, 'color')}20`, 
                      color: getCategoryInfo(expense.category, expenseCategories, 'color') 
                    }}
                  >
                    {getCategoryInfo(expense.category, expenseCategories)}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currSymbol}{expense.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {activeTrip.status === 'open' && (
                    <>
                      <button
                        onClick={() => handleEdit(expense)}
                        className={`text-sm mr-3 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this expense?')) {
                            deleteExpense(expense.id);
                          }
                        }}
                        className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;