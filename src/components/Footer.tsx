import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import LanguageSelector from './LanguageSelector';

const Footer: React.FC = () => {
  const {t} = useTranslation();
  const location = useLocation();

  // Don't render footer on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 0',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1100,
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
