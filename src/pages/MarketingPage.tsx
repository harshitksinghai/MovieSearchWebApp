import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './MarketingPage.css'; // External CSS file
import SubNavBar from '../components/SubNavBar';
import { ThemeContext } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';


const MarketingPage = () => {
  const navigate = useNavigate();
    const { darkMode } = useContext(ThemeContext);
    const {t} = useTranslation();
  
  function handleClick() {
    console.log("click click market -> /home")
    navigate('/home');
  }
  
  return (
    <div className='main-c'>
    <SubNavBar />
    <div className={`marketing-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="hero-section">
        <div className="content">
          <h1 className="title">{t('market.appName')}</h1>
          <button className="cta-button" onClick={handleClick}>
            {t('market.getStarted')}
          </button>
        </div>
      </div>
    </div>
    </div>

  );
}

export default MarketingPage;