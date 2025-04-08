import {
    parsePhoneNumberFromString,
    AsYouType,
    getCountries,
    getCountryCallingCode,
    CountryCode,
    isSupportedCountry
  } from 'libphonenumber-js/mobile';
  
  // Interface for country data
  export interface CountryData {
    code: CountryCode;
    name: string; 
    dialCode: string;
    flag: string;
  }
  
  // Get all supported countries with metadata
  export const getCountriesData = (): CountryData[] => {
    const supportedCountries = getCountries();
    
    return supportedCountries
      .filter(country => isSupportedCountry(country))
      .map(country => {
        // Use emoji flag based on country code
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
  
  // Function to get country name from country code
  export const getCountryName = (countryCode: string): string => {
    try {
      // Use Intl.DisplayNames for localized country names
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return regionNames.of(countryCode) || countryCode;
    } catch (e) {
      return countryCode;
    }
  };
  
  // Convert country code to emoji flag
  export const getFlagEmoji = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    
    return String.fromCodePoint(...codePoints);
  };
  
  // Format phone number as user types
  export const formatPhoneNumberAsYouType = (phoneNumber: string, countryCode: CountryCode): string => {
    return new AsYouType(countryCode).input(phoneNumber);
  };
  export const unformatPhoneNumber = (phoneNumber: string): string => {
    // Remove all non-digit characters except the leading + sign
    return phoneNumber.replace(/[^\d+]/g, '');
  };
  
  // For validating phone numbers
  export const isValidPhoneNumber = (phoneNumber: string, countryCode: CountryCode): boolean => {
    if (!phoneNumber || !countryCode) return false;
    
    try {
      // Special handling for Argentina - they require 9 at the beginning for mobile
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
  
  // Parse full phone number with country code
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