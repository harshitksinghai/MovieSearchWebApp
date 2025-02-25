import Logo from './UI/Logo';
import styles from './Navbar.module.css';
import LanguageSelector from './LanguageSelector'
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const SubNavbar: React.FC = () => {
  return (
    <div>
      <div className={styles["nav-container"]}>
        <Link to={"/"}>
          <Logo />
        </Link>
        <div className={styles["notLogo"]}>
        <LanguageSelector />
        <DarkModeToggle />
        </div>
        
      </div>
    </div>
  )
}

export default SubNavbar
