import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Tooltip from '@mui/material/Tooltip';
import { themePalettes, useCustomTheme } from '../context/CustomThemeProvider';
import { useTranslation } from 'react-i18next';

const DarkModeToggle: React.FC = () => {
  const { t } = useTranslation();
  const { currentTheme, darkMode, toggleDarkMode } = useCustomTheme();

    const getCurrentPalette = () => {
      const palette = themePalettes[currentTheme];
      return darkMode ? palette.dark : palette.light;
    };
  
    const currentPalette = getCurrentPalette();
  
  return (
    <Tooltip title={darkMode ? t('navbar.lightTooltip') : t('navbar.darkTooltip')}>
      <IconButton onClick={toggleDarkMode} color="inherit">
        {darkMode ? <Brightness7Icon sx={{color: currentPalette.primary}}/> : <Brightness4Icon sx={{color: currentPalette.primary}}/>}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;