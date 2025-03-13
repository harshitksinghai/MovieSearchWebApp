import { useTranslation } from 'react-i18next';
import { FormControl, Select, MenuItem, Typography, Box } from '@mui/material';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sp', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <FormControl size="small">
      <Select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        sx={{
          backgroundColor: '#222',
          color: 'white',
          borderRadius: '8px',
          height: '38px',
          marginTop: '2px',
          '& .MuiSvgIcon-root': {
            color: 'white !important',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: '#222',
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
                backgroundColor: '#333',
              },
              '&.Mui-selected': {
                backgroundColor: '#444',
                '&:hover': {
                  backgroundColor: '#555',
                },
              },
            }}
          >
           <Box sx={{display: 'flex'}}><Typography sx={{fontSize: 10, mt: '6px', mr: '5px'}}>{lang.code.toUpperCase()}</Typography> {lang.name}</Box>

          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;