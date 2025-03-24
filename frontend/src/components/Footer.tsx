import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider';

const Footer: React.FC = () => {
  const {t} = useTranslation();

    const { currentTheme, darkMode } = useCustomTheme();
    const getCurrentPalette = () => {
      const palette = themePalettes[currentTheme];
      return darkMode ? palette.dark : palette.light;
    };
  
    const currentPalette = getCurrentPalette();

  return (
    
    <Box
      sx={{
        position: 'fixed',
        bottom: '0',
        zIndex: '10',
        backgroundColor: currentPalette.background,
        color: currentPalette.textPrimary,
        padding: '10px 0',
        textAlign: 'center',
        width: '100%',
        marginTop: 'auto',
        boxShadow: `0 4px 20px rgba(${currentPalette.accent}, 0.15)`
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} 
        {t('footer.message')}
      </Typography>
    </Box>
    
  );
};

export default Footer;
