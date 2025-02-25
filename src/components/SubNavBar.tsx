import Logo from './UI/Logo';
import './Navbar.css';
import LanguageSelector from './LanguageSelector'
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const MovieDetailsNavbar: React.FC = () => {
  return (
    <div>
      <div className="nav-container">
        <Link to={"/"}>
          <Logo />
        </Link>
        <div className="notLogo">
        <LanguageSelector />
        <DarkModeToggle />
        </div>
        
      </div>
    </div>
  )
}

export default MovieDetailsNavbar
