import Logo from './ui/Logo'
import SearchBar from './SearchBar';
import LanguageSelector from '../components/LanguageSelector';
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import { setSearchState, setError, resetSearchBox } from '../features/search/searchSlice';
import { useAuth } from "react-oidc-context";
import UserButton from './UserButton';
import { memo, useCallback, useState } from 'react';
import ProfilePopup from './ProfilePopup';
import ThemeSelector from './ThemeSelector';
import { useCustomTheme, themePalettes } from '../context/CustomThemeProvider';

interface NavBarProps {
  isSearchBar: boolean;
}

const Navbar: React.FC<NavBarProps> = (props: { isSearchBar: boolean }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const auth = useAuth();

    const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  const currentPalette = getCurrentPalette();

  const [profilePopupOpen, setProfilePopupOpen] = useState(false);

  const handleProfilePopupOpen = useCallback(() => {
    setProfilePopupOpen(true);
  }, []);

  const handleProfilePopupClose = useCallback(() => {
    setProfilePopupOpen(false);
  }, []);

  const handleNavLinkClick = () => {
    dispatch(setSearchState(false));
    dispatch(setError(null));
    dispatch(resetSearchBox());
  };




  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: currentPalette.background,
        height: '4.5rem',
        boxShadow: `0 4px 20px rgba(${currentPalette.accent}, 0.15)`,
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
          {auth.isAuthenticated && (
            <>
              <Link to="/mylist" onClick={handleNavLinkClick} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    marginTop: '0.2rem',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: currentPalette.textPrimary
                  }}
                >
                  {t('navbar.fav')}
                </Typography>
              </Link>
              <Link to="/watchlater" onClick={handleNavLinkClick} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    marginTop: '0.2rem',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: currentPalette.textPrimary
                  }}
                >
                  {t('navbar.watchLater')}
                </Typography>
              </Link>
            </>
          )}
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

          <DarkModeToggle />
          <ThemeSelector />
          <LanguageSelector />

          {/* Authentication buttons */}
          {
            !auth.isAuthenticated && (
              <Button
                onClick={() => auth.signinRedirect()}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  height: '2.4rem',
                  marginTop: '0.125rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  color: currentTheme === 'White' && darkMode ? '#222' : '#fff', // White text for better contrast on primary button
                  backgroundColor: currentPalette.primary,
                  '&:hover': {
                    backgroundColor: currentPalette.secondary,
                    color: currentTheme === 'White' && darkMode ? '#222' : '#fff',
                    transform: 'translateY(-3px)',
                    boxShadow: `0 10px 20px rgba(${currentPalette.accent}, ${darkMode ? 0.3 : 0.2})`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {t('navbar.signIn')}
              </Button>
            )}
          
            {auth.isAuthenticated && (
              <UserButton openProfilePopup={handleProfilePopupOpen} />
            )
          }
          <ProfilePopup open={profilePopupOpen} handleClose={handleProfilePopupClose} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default memo(Navbar);