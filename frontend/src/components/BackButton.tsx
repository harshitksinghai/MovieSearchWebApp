import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Tooltip title={t('backToolTip')}>
      <IconButton 
        onClick={handleGoBack}
        sx={{
          position: 'absolute', 
          top: 16, 
          left: 16, 
          zIndex: 10
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;