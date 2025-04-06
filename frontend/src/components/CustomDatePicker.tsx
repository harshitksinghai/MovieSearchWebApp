import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  id: string;
  name: string;
  label: string;
  error?: boolean;
  helperText?: string | false;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  inputLabelProps?: any;
  maxDate?: Date;
  displayFormat?: string;
  themeColors?: {
    textPrimary: string;
    background: string;
  };
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  onBlur,
  id,
  name,
  label,
  error,
  helperText,
  required = false,
  placeholder,
  disabled = false,
  inputLabelProps,
  maxDate = new Date(),
  displayFormat = 'YYYY-MM-DD', // Default format
  themeColors = { textPrimary: 'inherit', background: 'inherit' }
}) => {
  // Convert string value to dayjs object
  const [date, setDate] = useState<dayjs.Dayjs | null>(
    value ? dayjs(value) : null
  );

  // Update internal state when value prop changes
  useEffect(() => {
    setDate(value ? dayjs(value) : null);
  }, [value]);

  // Handle date change from the DatePicker component
  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setDate(newDate);
    // Convert back to string format for the form
    onChange(newDate ? newDate.format('YYYY-MM-DD') : '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={date}
        onChange={handleDateChange}
        format={displayFormat}
        disabled={disabled}
        maxDate={dayjs(maxDate)}
        slotProps={{
          textField: {
            id,
            name,
            label,
            required,
            placeholder,
            fullWidth: true,
            size: "small",
            error,
            helperText,
            onBlur,
            InputLabelProps: {
              ...inputLabelProps,
              shrink: true
            },
            sx: {
              '& .MuiInputBase-input': {
                color: themeColors.textPrimary
              },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              },
              '& .MuiInputLabel-root': {
                color: themeColors.textPrimary
              }
            },
          },
          popper: {
            sx: {
              '& .MuiPaper-root': {
                bgcolor: themeColors.background,
                color: themeColors.textPrimary
              }
            }
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;