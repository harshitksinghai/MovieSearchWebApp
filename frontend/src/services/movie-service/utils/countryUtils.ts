// utils/countryUtils.ts
import countryToCurrency from 'country-to-currency';

export const formatCurrency = (amount: number, countryCode: string): string => {
  if (!amount && amount !== 0) return '';
    console.log("formatCurrency => countryCode: ", countryCode)
  const currency = countryToCurrency[countryCode as keyof typeof countryToCurrency] || 'INR';
  
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};
