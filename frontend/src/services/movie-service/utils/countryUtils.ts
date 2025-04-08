import clm from 'country-locale-map';

export const formatCurrency = (amount: number, countryCode: string): string => {
  if (!amount && amount !== 0) return '';
    console.log("formatCurrency => countryCode: ", countryCode)

  const countryDetails = clm.getCountryByAlpha2(countryCode); 
  const locale = countryDetails?.default_locale.replace('_', '-');
  const currency = countryDetails?.currency ?? 'INR';

  console.log("formatCurrency => locale: ", locale);
  console.log("formatCurrency => currency: ", currency);

  const res = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
  console.log("formatCurrency => result: ", res);
  return res;
};
