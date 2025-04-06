import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { Box } from '@mui/material';
import {
  parsePhoneNumberFromString,
  AsYouType,
  getCountries,
  getCountryCallingCode,
  CountryCode,
  isSupportedCountry
} from 'libphonenumber-js/mobile';
import i18n from '@/i18n/config';

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
const getCountryName = (countryCode: string): string => {
  const storedLanguage = localStorage.getItem('i18nextLng') || i18n.language;
  // Use Intl.DisplayNames for localized country names
  const regionNames = new Intl.DisplayNames([storedLanguage], { type: 'region' });
  try {
    return regionNames.of(countryCode) || countryCode;
  } catch (e) {
    return countryCode;
  }
};

// Convert country code to emoji flag
const getFlagEmoji = (countryCode: string): string => {
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

// For validating phone numbers (can be used in validation schema)
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
      phoneNumber: parsedNumber?.nationalNumber || ''
    };
  } catch (e) {
    console.error('Error parsing phone number:', e);
    return {
      countryCode: null,
      phoneNumber: fullPhoneNumber
    };
  }
};

interface PhoneNumInputProps {
  value: {
    countryCode: CountryCode;
    phoneNumber: string;
  };
  placeholder?: string;
  onChange: (value: { countryCode: CountryCode; phoneNumber: string }) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: boolean;
  helperText?: React.ReactNode;
  label?: string;
  required?: boolean;
  id?: string;
  name?: string;
  countries?: CountryData[];
  currentPalette?: any;
}

const PhoneNumInput: React.FC<PhoneNumInputProps> = ({
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  helperText,
  label = 'Phone Number',
  required = false,
  id = 'phone',
  name = 'phone',
  countries = getCountriesData(),
  currentPalette,
}) => {
  // Format the phone number as the user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      phoneNumber: e.target.value,
    });
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const formattedNumber = formatPhoneNumberAsYouType(value.phoneNumber, value.countryCode);
    onChange({
      ...value,
      phoneNumber: formattedNumber,
    });
    
    // Call the original onBlur handler if provided
    if (onBlur) {
      onBlur(e);
    }
  };

  // Update country code when changed
  const handleCountryChange = (e: any) => {
    onChange({
      countryCode: e.target.value as CountryCode,
      phoneNumber: value.phoneNumber,
    });
  };

  return (
    <TextField
      fullWidth
      id={id}
      name={name}
      label={required ? `${label}*` : label}
      size="small"
      placeholder={placeholder}
      value={value.phoneNumber}
      onChange={handlePhoneChange}
      onBlur={handlePhoneBlur}
      error={error}
      helperText={helperText}
      InputLabelProps={{
        style: { color: currentPalette?.textPrimary }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FormControl variant="standard" size="small" sx={{ minWidth: 50 }}>
              <Select
                value={value.countryCode}
                onChange={handleCountryChange}
                disableUnderline
                sx={{
                  '& .MuiSelect-select': {
                    paddingRight: '14px',
                    paddingLeft: '4px',
                  }
                }}
                renderValue={(selected) => {
                    const country = countries.find(c => c.code === selected);
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 8 }}>{country?.flag}</span>
                        <span>{country?.dialCode}</span>
                      </Box>
                    );
                  }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                        <span style={{ marginRight: 8 }}>{country.flag}</span>
                        <span>{country.name}</span>
                        <span style={{ marginLeft: 8 }}>({country.dialCode})</span>
                      </Box>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PhoneNumInput;