import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Container } from '@mui/material';
import Navbar from "../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { useCustomTheme, themePalettes } from '../context/CustomThemeProvider';

const MarketingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
          height: 'calc(100vh - 120px)',
          backgroundImage: 'url("https://source.unsplash.com/random/1920x1080/?cinema")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
        }}>
          <Container sx={{
            textAlign: 'center',
          }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: '4rem',
                fontWeight: 700,
                marginBottom: '1rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                letterSpacing: '2px',
                color:  currentPalette.textPrimary,
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              {t('market.appName')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/home')}
              sx={{
                fontSize: '1.2rem',
                fontWeight: 600,
                padding: '1rem 2rem',
                borderRadius: '8px',
                color:  currentPalette.paper,
                backgroundColor:  currentPalette.primary,
                '&:hover': {
                  backgroundColor:  currentPalette.textPrimary,
                  transform: 'scale(1.05)',
                  color:  currentPalette.background,
                }
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