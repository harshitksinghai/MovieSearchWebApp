import Logo from './UI/Logo';
import SearchBar from './SearchBar';
import LanguageSelector from '../components/LanguageSelector';
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useSearch } from '../context/SearchContext';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Navbar: React.FC = () => {
  const { handleSearchState, handleError, handleTitle } = useSearch();
  const { t } = useTranslation();
    
  const handleNavLinkClick = () => {
    handleSearchState(false);
    handleError(null);
    handleTitle('');
  };

  return (
    <AppBar 
      position="static"
      sx={{ 
        backgroundColor: '#ededed',
        height: '74px',
        boxShadow: 0
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        height: '100%'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '30px' 
        }}>
          <Link to="/home" onClick={handleNavLinkClick} style={{ textDecoration: 'none' }}>
            <Logo />
          </Link>
          <Link to="/mylist" onClick={handleNavLinkClick} style={{ textDecoration: 'none' }}>
            <Typography 
              sx={{ 
                marginTop: '3px',
                fontSize: '20px',
                fontWeight: 500,
                color: '#222'
              }}
            >
              {t('navbar.mylist')}
            </Typography>
          </Link>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: '10px',
          marginRight: '20px'
        }}>
          <SearchBar />
          <LanguageSelector />
          <DarkModeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;