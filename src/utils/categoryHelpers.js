import { COLORS } from './colors';

export const getCategoryInfo = (categoryId, expenseCategories, returnType = 'name') => {
  const category = expenseCategories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return returnType === 'name' ? 'Unknown' : COLORS.neutral;
  }
  
  return returnType === 'name' ? category.name : category.color;
};