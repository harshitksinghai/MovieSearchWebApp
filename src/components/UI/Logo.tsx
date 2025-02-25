import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles';
import './Logo.css'

const Logo = () => {
const {t} = useTranslation();
const theme = useTheme();

  return (
    <div>
      <p className="logo" style={{ color: theme.palette.text.secondary }}>{t('navbar.appName')}</p>
    </div>
  )
}

export default Logo
