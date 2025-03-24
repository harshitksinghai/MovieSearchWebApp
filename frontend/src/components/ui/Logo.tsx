import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

const Logo = () => {
const {t} = useTranslation();
const theme = useTheme();

  return (
    <div>
      <Typography sx={{fontSize: '1.5rem', fontWeight: '600', ml: '0.15rem', color: theme.palette.text.primary}}>{t('navbar.appName')}</Typography>
    </div>
  )
}

export default Logo