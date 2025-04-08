import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

export const getDateFormatByCountry = (country: string | null): string => {
  if (!country) return 'DD/MM/YYYY';

  try {
    const date = new Date(2000, 0, 1); // January 1, 2000
    const formatter = new Intl.DateTimeFormat(country, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const parts = formatter.formatToParts(date);
    let format = '';
    let separator = '';
    
    for (const part of parts) {
      if (part.type === 'literal') {
        separator = part.value;
        break;
      }
    }
    
    if (!separator) separator = '/';
    
    const partOrder: string[] = [];
    for (const part of parts) {
      if (part.type === 'day') partOrder.push('DD');
      if (part.type === 'month') partOrder.push('MM');
      if (part.type === 'year') partOrder.push('YYYY');
    }
    
    format = partOrder.join(separator);
    console.log("getDateFormatByCountry: ", format)
    return format;
  } catch (error) {
    console.log("getDateFormatByCountry => error fallback: DD/MM/YYYY")
    return 'DD/MM/YYYY';
  }
};

export const formatDateForStorage = (dateString: string | null): string => {
  if (!dateString) return '';
  
  const middayDate = dayjs(dateString).hour(12).minute(0).second(0);
  return middayDate.utc().format('YYYY-MM-DD');
};

export const formatDateForDisplay = (dateObj: Date | null, country: string | null): string => {
  if (!dateObj || !country) return '';
  
  const format = getDateFormatByCountry(country);
  return dayjs(dateObj).format(format);
};

export const formatDateForInput = (dateObj: Date | null): string => {
  if (!dateObj) return '';
  return dayjs(dateObj).format('YYYY-MM-DD');
};

export const parseUTCDate = (utcDateString: string | null): Date | null => {
  if (!utcDateString) return null;
  return dayjs.utc(utcDateString).hour(12).minute(0).second(0).local().toDate();
};