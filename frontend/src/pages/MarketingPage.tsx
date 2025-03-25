import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Container, useMediaQuery, useTheme } from '@mui/material';
import Navbar from "../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { useCustomTheme, themePalettes } from '../context/CustomThemeProvider';

const MarketingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  const currentPalette = getCurrentPalette();

  return (
    <Box sx={{
      height: '100%',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <Navbar isSearchBar={false} />
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        bgcolor: currentPalette.background,
      }}>
        <Box sx={{
          width: '100%',
          height: isMobile ? 'calc(100vh - 80px)' : 'calc(100vh - 120px)',
          backgroundImage: 'url("https://source.unsplash.com/random/1920x1080/?cinema")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }
        }}>
          <Container sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 2, // Ensure content is above the overlay
            px: isMobile ? 2 : 0 // Add padding on mobile
          }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: isMobile ? '2.5rem' : '4rem',
                fontWeight: 700,
                marginBottom: '1rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                letterSpacing: isMobile ? '1px' : '2px',
                color: currentPalette.textPrimary,
                fontFamily: '"Montserrat", sans-serif',
                wordBreak: 'break-word', // Ensure long text doesn't overflow
                overflowWrap: 'break-word',
              }}
            >
              {t('market.appName')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/home')}
              sx={{
                fontSize: isMobile ? '1rem' : '1.2rem',
                fontWeight: 600,
                padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
                borderRadius: '8px',
                color: currentPalette.paper,
                backgroundColor: currentPalette.primary,
                '&:hover': {
                  backgroundColor: currentPalette.textPrimary,
                  transform: 'scale(1.05)',
                  color: currentPalette.background,
                },
                marginTop: isMobile ? '0.5rem' : 0
              }}
            >
              {t('market.getStarted')}
            </Button>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default MarketingPage;