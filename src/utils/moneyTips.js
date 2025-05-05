import { MONEY_SAVING_TIPS } from '../data/defaultData';
import { calculateCategoryTotal } from './calculations';
import { getCategoryInfo } from './categoryHelpers';

export const getMoneyTips = (activeTrip, expenseCategories) => {
  if (!activeTrip || activeTrip.expenses?.length === 0) {
    return {
      category: 'general',
      tips: [
        "Set a daily spending limit before your trip",
        "Research the average costs at your destination",
        "Look for destination-specific discounts before traveling"
      ]
    };
  }

  // Find the category with highest spending
  const categoryTotals = {};
  expenseCategories.forEach(cat => {
    categoryTotals[cat.id] = calculateCategoryTotal(cat.id, activeTrip);
  });

  const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  return {
    category: getCategoryInfo(highestCategory, expenseCategories),
    tips: MONEY_SAVING_TIPS[highestCategory] || MONEY_SAVING_TIPS.other
  };
};