import Logo from './ui/Logo'
import SearchBar from './SearchBar';
import LanguageSelector from '../components/LanguageSelector';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, Box, useTheme, Button } from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import { setSearchState, setError, resetSearchBox } from '../features/search/searchSlice';
import { useAuth } from "react-oidc-context";

const AUTH_COGNITO_DOMAIN = import.meta.env.VITE_AUTH_COGNITO_DOMAIN;
const AUTH_COGNITO_CLIENT_ID = import.meta.env.VITE_AUTH_COGNITO_CLIENT_ID;

interface NavBarProps {
  isSearchBar: boolean;
}

const Navbar: React.FC<NavBarProps> = (props: { isSearchBar: boolean }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const location = useLocation();
  const isMarketingPage = location.pathname === '/';

  const handleNavLinkClick = () => {
    dispatch(setSearchState(false));
    dispatch(setError(null));
    dispatch(resetSearchBox());
  };

  const signOutRedirect = () => {
    auth.removeUser();
    
    const clientId = AUTH_COGNITO_CLIENT_ID;
    const logoutUri = window.location.origin;
    const cognitoDomain = AUTH_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
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
          <Link to={auth.isAuthenticated ? "/home" : "/"} onClick={handleNavLinkClick} style={{ textDecoration: 'none' }}>
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
          alignItems: 'center',
          gap: '10px',
          marginRight: '20px'
        }}>
          {props.isSearchBar && (
            <SearchBar />
          )}
          
          {/* Authentication buttons */}
          {isMarketingPage ? (
            !auth.isAuthenticated && (
              <Button 
                onClick={() => auth.signinRedirect()}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  height: '38px',
                  marginTop: '2px',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  color: theme.palette.text.secondary,
                  backgroundColor: theme.palette.background.flow,
                  '&:hover': {
                    backgroundColor: theme.palette.background.flowHover,
                    color: theme.palette.text.secondary,
                  }
                }}
              >
                {t('navbar.signIn')}
              </Button>
            )
          ) : (
            auth.isAuthenticated && (
              <Button 
                onClick={signOutRedirect}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  height: '38px',
                  marginTop: '2px',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  color: theme.palette.text.secondary,
                  backgroundColor: theme.palette.background.flow,
                  '&:hover': {
                    backgroundColor: theme.palette.background.flowHover,
                    color: theme.palette.text.secondary,
                  }
                }}
              >
                {t('navbar.signOut')}
              </Button>
            )
          )}
          
          <LanguageSelector />
          <DarkModeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;