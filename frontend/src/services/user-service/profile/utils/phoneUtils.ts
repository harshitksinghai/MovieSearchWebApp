import {
    parsePhoneNumberFromString,
    AsYouType,
    getCountries,
    getCountryCallingCode,
    CountryCode,
    isSupportedCountry
  } from 'libphonenumber-js/mobile';
  
  export interface CountryData {
    code: CountryCode;
    name: string; 
    dialCode: string;
    flag: string;
  }
  
  export const getCountriesData = (): CountryData[] => {
    const supportedCountries = getCountries();
    
    return supportedCountries
      .filter(country => isSupportedCountry(country))
      .map(country => {
        const flag = getFlagEmoji(country);
        const dialCode = `+${getCountryCallingCode(country)}`;
        
        return {
          code: country as CountryCode,
          name: getCountryName(country),
          dialCode,
          flag
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };
  
  export const getCountryName = (countryCode: string): string => {
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return regionNames.of(countryCode) || countryCode;
    } catch (e) {
      return countryCode;
    }
  };
  
  export const getFlagEmoji = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    
    return String.fromCodePoint(...codePoints);
  };
  
  export const formatPhoneNumberAsYouType = (phoneNumber: string, countryCode: CountryCode): string => {
    return new AsYouType(countryCode).input(phoneNumber);
  };
  export const unformatPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/[^\d+]/g, '');
  };
  
  export const isValidPhoneNumber = (phoneNumber: string, countryCode: CountryCode): boolean => {
    if (!phoneNumber || !countryCode) return false;
    
    try {
      if (countryCode === 'AR') {
        if (!phoneNumber.startsWith('9')) {
          phoneNumber = '9' + phoneNumber;
        }
      }
      const fullNumber = `+${getCountryCallingCode(countryCode)}${phoneNumber}`;
      const parsedNumber = parsePhoneNumberFromString(fullNumber, countryCode);
      return parsedNumber?.isValid() || false;
    } catch (e) {
      console.error('Error in isValidPhoneNumber:', e);
      return false;
    }
  };
  
  export const parseFullPhoneNumber = (fullPhoneNumber: string): { 
    countryCode: CountryCode | null; 
    phoneNumber: string 
  } => {
    try {
      const parsedNumber = parsePhoneNumberFromString(fullPhoneNumber);
      return {
        countryCode: parsedNumber?.country || null,
        phoneNumber: parsedNumber?.nationalNumber?.toString() || ''
      };
    } catch (e) {
      console.error('Error parsing phone number:', e);
      return {
        countryCode: null,
        phoneNumber: fullPhoneNumber
      };
    }
  };