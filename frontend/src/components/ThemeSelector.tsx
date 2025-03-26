import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  PaperProps
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckIcon from '@mui/icons-material/Check';
import { useCustomTheme, ThemeName, themePalettes } from '../context/CustomThemeProvider';
import { useTranslation } from 'react-i18next';

// Define colored circle icons for each theme
const ThemeCircle: React.FC<{ color: string, selected: boolean }> = ({ color, selected }) => {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid #ccc'
      }}
    >
      {selected && <CheckIcon style={{ fontSize: 16, color: color === '#ffffff' ? '#000' : '#fff' }} />}
    </div>
  );
};

const ThemeSelector: React.FC = () => {
  const { t } = useTranslation();
  const { currentTheme, setCurrentTheme, availableThemes, darkMode } = useCustomTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  const currentPalette = getCurrentPalette();

  // Theme colors for the circles (using primary colors from light mode)
  const themeColors: Record<ThemeName, string> = {
    Blue: '#0066ff',
    White: '#fff',
    Green: '#00b300'
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (theme: ThemeName) => {
    setCurrentTheme(theme);
    handleClose();
  };

  // Function to get translated theme name
  const getTranslatedThemeName = (theme: ThemeName) => {
    return t(`customTheme.${theme}`);
  };

  // Custom PaperProps to ensure consistent background
  const menuPaperProps: PaperProps = {
    sx: {
      backgroundColor: '#222',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    }
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        startIcon={<PaletteIcon />}
        sx={{
          textTransform: 'none',
          color: currentTheme === 'White' && darkMode ? '#222' : '#fff',
          bgcolor: currentPalette.primary,
          borderRadius: '0.5rem',
          height: '2.4rem',
          marginTop: '0.125rem'
        }}
      >
        {t('customTheme.theme')}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={menuPaperProps}
      >
        {availableThemes.map((theme) => (
          <MenuItem
            key={theme}
            onClick={() => handleThemeChange(theme)}
            selected={theme === currentTheme}
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
            <ListItemIcon>
              <ThemeCircle color={themeColors[theme]} selected={theme === currentTheme} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1">
                {getTranslatedThemeName(theme)}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ThemeSelector;