import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import Navbar from "../components/Navbar"

const MarketingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  
  function handleClick() {
    console.log("click click market -> /home");
    navigate('/home');
  }
  
  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <Navbar isSearchBar={false}/>
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        bgcolor: theme.palette.background.default,
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
                color: theme.palette.text.flow,
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              {t('market.appName')}
            </Typography>
            <Button 
              variant="contained"
              onClick={handleClick}
              sx={{
                fontSize: '1.2rem',
                fontWeight: 600,
                padding: '1rem 2rem',
                borderRadius: '8px',
                color: theme.palette.text.secondary,
                backgroundColor: theme.palette.background.flow,
                '&:hover': {
                  backgroundColor: theme.palette.background.flowHover,
                  transform: 'scale(1.05)',
                  color: theme.palette.text.secondary,
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