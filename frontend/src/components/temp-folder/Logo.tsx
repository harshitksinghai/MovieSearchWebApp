import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

const Logo = () => {
const {t} = useTranslation();
const theme = useTheme();

  return (
    <div>
      <Typography sx={{fontSize: '35px', fontWeight: '600', ml: '20px', color: theme.palette.text.primary}}>{t('navbar.appName')}</Typography>
    </div>
  )
}

export default Logo