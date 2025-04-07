import Logo from './ui/Logo'
import SearchBar from '../services/search-service/components/SearchBar';
import LanguageSelector from '../components/LanguageSelector';
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from '@mui/material';
import { useAppDispatch } from '../app/reduxHooks';
import { setSearchState, setError, resetSearchBox } from '../redux/search/searchSlice';
import { useAuth } from "react-oidc-context";
import UserButton from '../services/user-service/profile/components/UserButton';
import { memo, useCallback, useState } from 'react';
import ProfilePopup from '../services/user-service/profile/pages/ProfilePopup';
import ThemeSelector from './ThemeSelector';
import { useCustomTheme, themePalettes } from '../context/CustomThemeProvider';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

interface NavBarProps {
  isSearchBar: boolean;
}

const Navbar: React.FC<NavBarProps> = (props: { isSearchBar: boolean }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const isMobile = useMediaQuery('(max-width:1300px)');

  const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  const currentPalette = getCurrentPalette();

  const [profilePopupOpen, setProfilePopupOpen] = useState(false);

  // Mobile state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const handleProfilePopupOpen = useCallback(() => {
    setProfilePopupOpen(true);
  }, []);

  const handleProfilePopupClose = useCallback(() => {
    setProfilePopupOpen(false);
  }, []);

  const handleNavLinkClick = (): void => {
    dispatch(setSearchState(false));
    dispatch(setError(null));
    dispatch(resetSearchBox());
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleMobileSearch = () => {
    setMobileSearchVisible(!mobileSearchVisible);
  };

  return (
    <>
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
            gap: '1.5rem'
          }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ color: currentPalette.textPrimary }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Link to={auth.isAuthenticated ? "/home" : "/"} onClick={handleNavLinkClick} style={{ textDecoration: 'none' }}>
              <Logo />
            </Link>

            {!isMobile && auth.isAuthenticated && (
              <>
                <Link to="/mylist" onClick={handleNavLinkClick} style={{ textDecoration: 'none' }}>
                  <Typography
                    sx={{
                      marginTop: '0.2rem',
                      fontSize: '1rem',
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
                      fontSize: '1rem',
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
            marginRight: isMobile ? '0' : '20px'
          }}>
            {/* For desktop: show search bar as normal */}
            {!isMobile && props.isSearchBar && (
              <SearchBar />
            )}

            {/* For mobile: show search icon */}
            {isMobile && props.isSearchBar && (
              <IconButton
                onClick={toggleMobileSearch}
                sx={{
                  color: currentPalette.textPrimary
                }}
              >
                <SearchIcon />
              </IconButton>
            )}

            {/* For desktop: show these items as normal */}
            {!isMobile && (
              <>
                <DarkModeToggle />
                <ThemeSelector />
                <LanguageSelector />
              </>
            )}

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

      {/* Mobile search bar that appears below the AppBar */}
      {isMobile && mobileSearchVisible && (
        <Box sx={{
          padding: '1rem',
          backgroundColor: currentPalette.background,
          boxShadow: `0 4px 8px rgba(${currentPalette.accent}, 0.1)`,
          width: '100%',
          zIndex: 100
        }}>
          <SearchBar />
        </Box>
      )}

      {/* Mobile drawer menu */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              width: '80%',
              maxWidth: '300px',
              backgroundColor: currentPalette.background,
              padding: '1rem 0',
              color: currentPalette.textPrimary
            }
          }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 1rem 1rem',
            borderBottom: `1px solid rgba(${currentPalette.accent}, 0.1)`
          }}>
            <Link to={auth.isAuthenticated ? "/home" : "/"} onClick={handleNavLinkClick} style={{ textDecoration: 'none' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {t('navbar.appName')}
              </Typography>
            </Link>

            <IconButton onClick={toggleDrawer} sx={{ color: currentPalette.textPrimary }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {auth.isAuthenticated && (
              <>
                <ListItem component={Link} to="/mylist" onClick={handleNavLinkClick}>
                  <ListItemText primary={t('navbar.fav')} />
                </ListItem>
                <ListItem component={Link} to="/watchlater" onClick={handleNavLinkClick}>
                  <ListItemText primary={t('navbar.watchLater')} />
                </ListItem>
              </>
            )}

            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Typography sx={{
                  fontSize: '0.875rem',
                  mb: 1,
                  color: currentPalette.textPrimary
                }}>
                  {t('navbar.appearance')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ThemeSelector />
                    <DarkModeToggle />
                  </Box>
                </Box>
              </Box>
            </ListItem>

            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Typography sx={{
                  fontSize: '0.875rem',
                  mb: 1,
                  color: currentPalette.textPrimary
                }}>
                  {t('navbar.language')}
                </Typography>
                <LanguageSelector />
              </Box>
            </ListItem>
          </List>
        </Drawer>
      )}
    </>
  );
};

export default memo(Navbar);