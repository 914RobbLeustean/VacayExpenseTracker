import { CURRENCY_SYMBOLS, CONSTANTS } from './constants';

export const getCurrencySymbol = (currency) => {
  return CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS[CONSTANTS.DEFAULT_CURRENCY];
};