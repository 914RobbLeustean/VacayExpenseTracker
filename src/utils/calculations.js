import { DEFAULT_BUDGET_TEMPLATE } from '../data/defaultData';

export const calculateCategoryTotal = (category, activeTrip) => {
  if (!activeTrip) return 0;
  return activeTrip.expenses
    .filter(expense => expense.category === category)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const getTotalExpenses = (activeTrip) => {
  if (!activeTrip) return 0;
  return activeTrip.expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getTotalBudget = (activeTrip) => {
  if (!activeTrip) return 0;
  return Object.values(activeTrip.budget || DEFAULT_BUDGET_TEMPLATE)
    .reduce((sum, value) => sum + value, 0);
};

export const getExpensesByDay = (activeTrip) => {
  if (!activeTrip) return [];
  const dailyExpenses = {};

  activeTrip.expenses.forEach(expense => {
    if (!dailyExpenses[expense.date]) {
      dailyExpenses[expense.date] = 0;
    }
    dailyExpenses[expense.date] += expense.amount;
  });

  return Object.keys(dailyExpenses).map(date => ({
    date,
    amount: dailyExpenses[date]
  }));
};

export const getExpensesByCategory = (activeTrip, getCategoryInfo) => {
  if (!activeTrip) return [];
  const categoryExpenses = {};

  activeTrip.expenses.forEach(expense => {
    if (!categoryExpenses[expense.category]) {
      categoryExpenses[expense.category] = 0;
    }
    categoryExpenses[expense.category] += expense.amount;
  });

  return Object.keys(categoryExpenses).map(category => ({
    category: getCategoryInfo(category, 'name'),
    amount: categoryExpenses[category],
    id: category
  }));
};

export const getExpenseSummary = (activeTrip) => {
  const totalBudget = getTotalBudget(activeTrip);
  const totalExpenses = getTotalExpenses(activeTrip);
  const remaining = totalBudget - totalExpenses;

  return {
    totalBudget,
    totalExpenses,
    remaining,
    percentUsed: totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0
  };
};