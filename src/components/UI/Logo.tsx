import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles';
import styles from './Logo.module.css'

const Logo = () => {
const {t} = useTranslation();
const theme = useTheme();

  return (
    <div>
      <p className={styles.logo} style={{ color: theme.palette.text.secondary }}>{t('navbar.appName')}</p>
    </div>
  )
}

export default Logo
