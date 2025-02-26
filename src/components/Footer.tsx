import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

const Footer: React.FC = () => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#ededed',
        color: theme.palette.mode === 'dark' ? '#fff' : '#222',
        padding: '10px 0',
        textAlign: 'center',
        width: '100%',
        marginTop: 'auto',
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
