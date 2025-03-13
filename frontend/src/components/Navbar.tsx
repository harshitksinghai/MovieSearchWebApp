import Logo from './ui/Logo'
import SearchBar from './SearchBar';
import LanguageSelector from '../components/LanguageSelector';
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import { setSearchState, setError, resetSearchBox } from '../features/search/searchSlice';

interface NavBarProps{
  isSearchBar: boolean;
}

const Navbar: React.FC<NavBarProps> = (props: {isSearchBar: boolean}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const handleNavLinkClick = () => {
    dispatch(setSearchState(false));
    dispatch(setError(null));
    dispatch(resetSearchBox());
  };

  return (
    <AppBar 
      position="sticky"
      sx={{ 
        backgroundColor: theme.palette.background.nav,
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
                color: theme.palette.text.primary
              }}
            >
              {t('navbar.fav')}
            </Typography>
          </Link>
          <Link to="/watchlater" onClick={handleNavLinkClick} style={{ textDecoration: 'none' }}>
            <Typography 
              sx={{ 
                marginTop: '3px',
                fontSize: '20px',
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              {t('navbar.watchLater')}
            </Typography>
          </Link>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: '10px',
          marginRight: '20px'
        }}>
          {props.isSearchBar && (
            <SearchBar />
          )}
          <LanguageSelector />
          <DarkModeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;