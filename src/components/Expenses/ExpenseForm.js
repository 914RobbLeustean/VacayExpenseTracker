import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useExpenses } from '../../hooks/useExpenses';
import { getCurrencySymbol } from '../../utils/currency';

const ExpenseForm = () => {
  const { 
    darkMode, 
    expenseCategories, 
    showNewExpenseForm, 
    setShowNewExpenseForm, 
    currency
  } = useApp();
  const { editingExpense, setEditingExpense, addExpense, updateExpense } = useExpenses();
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });
  
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        description: editingExpense.description,
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        date: editingExpense.date
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingExpense]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount) {
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    
    if (editingExpense) {
      updateExpense(editingExpense.id, { ...formData, amount });
    } else {
      addExpense({ ...formData, amount });
    }
    
    setShowNewExpenseForm(false);
    setEditingExpense(null);
  };
  
  if (!showNewExpenseForm) return null;
  
  const currSymbol = getCurrencySymbol(currency);
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button 
            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              setShowNewExpenseForm(false);
              setEditingExpense(null);
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`w-full p-2 border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="e.g., Dinner at restaurant"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Amount
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
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                } rounded-md`}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className={`w-full p-2 border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
            >
              {expenseCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className={`mr-2 px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                darkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
              onClick={() => {
                setShowNewExpenseForm(false);
                setEditingExpense(null);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {editingExpense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;