import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { CONSTANTS } from '../utils/constants';
import { calculateCategoryTotal } from '../utils/calculations';
import { getCategoryInfo } from '../utils/categoryHelpers';

export const useExpenses = () => {
  const { trips, setTrips, activeTrip, setActiveTrip, setNotification, expenseCategories } = useApp();
  const [editingExpense, setEditingExpense] = useState(null);

  const addExpense = (expenseData) => {
    if (!activeTrip) {
      setNotification({
        type: 'error',
        message: 'Please create or select a trip first'
      });
      return;
    }

    const expense = {
      id: `expense-${Date.now()}`,
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      date: expenseData.date,
      fullDate: new Date()
    };

    const updatedTrips = trips.map(trip => {
      if (trip.id === activeTrip.id) {
        return { ...trip, expenses: [...(trip.expenses || []), expense] };
      }
      return trip;
    });

    setTrips(updatedTrips);
    setActiveTrip(prev => ({ ...prev, expenses: [...(prev.expenses || []), expense] }));

    // Check if over budget
    const categoryExpenses = calculateCategoryTotal(expenseData.category, activeTrip);
    const categoryBudget = activeTrip.budget[expenseData.category];

    if (categoryBudget > 0) {
      const percentUsed = ((categoryExpenses + expense.amount) / categoryBudget) * 100;
      
      if (percentUsed >= CONSTANTS.BUDGET_DANGER_THRESHOLD) {
        setNotification({
          type: 'warning',
          message: `You've exceeded your ${getCategoryInfo(expenseData.category, expenseCategories)} budget!`
        });
      } else if (percentUsed >= CONSTANTS.BUDGET_WARNING_THRESHOLD) {
        setNotification({
          type: 'info',
          message: `You're approaching your ${getCategoryInfo(expenseData.category, expenseCategories)} budget limit`
        });
      } else {
        setNotification({
          type: 'success',
          message: 'Expense added successfully!'
        });
      }
    } else {
      setNotification({
        type: 'success',
        message: 'Expense added successfully!'
      });
    }

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  const updateExpense = (expenseId, updatedData) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id === activeTrip.id) {
        const updatedExpenses = trip.expenses.map(exp =>
          exp.id === expenseId ? { ...exp, ...updatedData } : exp
        );
        return { ...trip, expenses: updatedExpenses };
      }
      return trip;
    });

    setTrips(updatedTrips);
  };

  const deleteExpense = (expenseId) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id === activeTrip.id) {
        const updatedExpenses = trip.expenses.filter(expense => expense.id !== expenseId);
        return { ...trip, expenses: updatedExpenses };
      }
      return trip;
    });

    setTrips(updatedTrips);
    
    setNotification({
      type: 'info',
      message: 'Expense deleted successfully!'
    });
    
    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  return {
    editingExpense,
    setEditingExpense,
    addExpense,
    updateExpense,
    deleteExpense
  };
};