import Logo from './UI/Logo';
import styles from './Navbar.module.css';
import SearchBar from './SearchBar';
import LanguageSelector from '../components/LanguageSelector'
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useSearch } from '../context/SearchContext';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { handleSearchState, handleError, handleTitle } = useSearch();
  const {t} = useTranslation();
    
    const handleNavLinkClick = () => {
        handleSearchState(false);
        handleError(null);
        handleTitle('');
    };

  return (
    <div>
      <div className={styles["nav-container"]}>
        <div className={styles['nav-links']}>
        <Link to={"/home"} onClick={handleNavLinkClick}>
          <Logo />
        </Link>
        <Link to={"/mylist"} onClick={handleNavLinkClick}>
        <p className={styles.myListLink}>{t('navbar.mylist')}</p>
        </Link>
        </div>
        <div className={styles.notLogo}>
        <SearchBar />
        <LanguageSelector />
        <DarkModeToggle />
        </div>
        
      </div>
    </div>
  )
}

export default Navbar
