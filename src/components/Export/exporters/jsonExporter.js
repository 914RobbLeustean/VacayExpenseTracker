import { generateJSON } from '../../../utils/exportHelpers';

export const exportJSON = (expenses, currency, expenseCategories) => {
  return generateJSON(expenses, currency, expenseCategories);
};