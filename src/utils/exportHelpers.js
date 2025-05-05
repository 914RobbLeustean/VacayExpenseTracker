import { formatDate } from './dateFormatters';
import { getCurrencySymbol } from './currency';
import { getCategoryInfo } from './categoryHelpers';

export const filterExpenses = (expenses, filters) => {
  return expenses.filter(expense => {
    // Date range filter
    if (filters.dateRange) {
      const expenseDate = new Date(expense.fullDate || expense.date);
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      
      if (expenseDate < fromDate || expenseDate > toDate) {
        return false;
      }
    }
    
    // Category filter
    if (filters.categories && !filters.categories.includes(expense.category)) {
      return false;
    }
    
    return true;
  });
};

export const generateCSV = (expenses, currency, expenseCategories) => {
  const headers = ['Date', 'Category', 'Description', 'Amount', 'Currency'];
  
  const rows = expenses.map(exp => [
    formatDate(exp.date, true),
    getCategoryInfo(exp.category, expenseCategories),
    exp.description,
    exp.amount.toFixed(2),
    getCurrencySymbol(currency)
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(value => `"${value}"`).join(','))
    .join('\n');
};

export const generateJSON = (expenses, currency, expenseCategories) => {
  return JSON.stringify(
    expenses.map(exp => ({
      date: formatDate(exp.date, true),
      category: getCategoryInfo(exp.category, expenseCategories),
      categoryId: exp.category,
      description: exp.description,
      amount: exp.amount,
      currency: getCurrencySymbol(currency)
    })),
    null,
    2
  );
};