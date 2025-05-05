import { generateCSV } from '../../../utils/exportHelpers';

export const exportCSV = (expenses, currency, expenseCategories) => {
  return generateCSV(expenses, currency, expenseCategories);
};