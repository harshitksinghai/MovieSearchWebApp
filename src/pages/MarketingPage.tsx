import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MarketingPage.module.css'; // External CSS file
import SubNavBar from '../components/SubNavBar';
import { ThemeContext } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const MarketingPage = () => {
  const navigate = useNavigate();
    const { darkMode } = useContext(ThemeContext);
    const {t} = useTranslation();
  
  function handleClick() {
    console.log("click click market -> /home")
    navigate('/home');
  }
  
  return (
    <div className={styles['main-c']}>
    <SubNavBar />
    <div className={clsx(styles["marketing-container"], darkMode ? styles["dark-mode"] : styles["light-mode"])}>
      <div className={styles["hero-section"]}>
        <div className={styles.content}>
          <h1 className={styles.title}>{t('market.appName')}</h1>
          <button className={styles["cta-button"]} onClick={handleClick}>
            {t('market.getStarted')}
          </button>
        </div>
      </div>
    </div>
    </div>

  );
}

export default MarketingPage;