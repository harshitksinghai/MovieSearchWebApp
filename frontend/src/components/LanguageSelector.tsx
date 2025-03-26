import { useTranslation } from 'react-i18next';
import { FormControl, Select, MenuItem, Typography, Box } from '@mui/material';
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

        const { currentTheme, darkMode } = useCustomTheme();
        const getCurrentPalette = () => {
          const palette = themePalettes[currentTheme];
          return darkMode ? palette.dark : palette.light;
        };
      
        const currentPalette = getCurrentPalette();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sp', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <FormControl size="small" sx={{ width: { xs: '100%', sm: 'auto' } }}>
  <Select
    value={i18n.language}
    onChange={(e) => i18n.changeLanguage(e.target.value)}
    sx={{
      backgroundColor: currentPalette.primary,
      color: currentTheme === 'White' && darkMode ? '#222' : '#fff',
      borderRadius: '0.5rem',
      height: '2.4rem',
      marginTop: '0.125rem',
      width: { xs: '100%', sm: 'auto' },
      '& .MuiSvgIcon-root': {
        color: currentTheme === 'White' && darkMode ? '#222' : '#fff',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: '#222',
          maxHeight: '50vh',
          '& .MuiList-root': {
            backgroundColor: '#222',
            padding: 0,
          },
        },
      },
    }}
  >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            value={lang.code}
            sx={{
              backgroundColor: '#222',
              color: 'white',
              '&:hover': {
                backgroundColor: currentPalette.secondary,
              },
              '&.Mui-selected': {
                backgroundColor: '#444',
                '&:hover': {
                  backgroundColor: currentPalette.secondary,
                },
              },
            }}
          >
           <Box sx={{display: 'flex'}}><Typography sx={{fontSize: '0.625rem', 
  mt: '0.375rem',  
  mr: '0.3rem', }}>{lang.code.toUpperCase()}</Typography> {lang.name}</Box>

          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;