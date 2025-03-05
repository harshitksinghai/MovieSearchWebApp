import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Tooltip from '@mui/material/Tooltip';
import { ThemeContext } from '../context/ThemeContext.tsx';
import { useTranslation } from 'react-i18next';

const DarkModeToggle: React.FC = () => {
  const {t} = useTranslation();
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const mode = darkMode ? 'dark' : 'light';

  return (
    <Tooltip title={mode === 'dark' ? t('navbar.lightTooltip') : t('navbar.darkTooltip')}>
      <IconButton onClick={toggleTheme} color="inherit" sx={{
          '&:hover': {
            backgroundColor: '#d6d6d6',
          },
        }}>
        {mode === 'dark' ? <Brightness7Icon sx={{color: "black"}} /> : <Brightness4Icon sx={{color: "black"}}/>}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;