import { useTranslation } from 'react-i18next';
import ShowSavedList from './ShowSavedList.tsx';
import { Box, Typography, useTheme } from '@mui/material';
import { useAppSelector } from '../app/hooks.ts';
import { filterWatchLater } from '../features/filter/filterSlice.ts';

const WatchLater = () => {
  console.log("Inside WatchLater.tsx");

  const {t} = useTranslation();
  const theme = useTheme();

  const filteredMovieList = useAppSelector(filterWatchLater);

  return (
    <Box>
      <Typography 
        variant="h2" 
        sx={{
          fontWeight: 600,
          fontSize: '50px',
          textAlign: 'center',
          marginTop: '20px',
          color: theme.palette.text.flow
        }}
      >
        {t('watchLater.watchLater')}
      </Typography>
      <ShowSavedList filteredList={filteredMovieList} />
    </Box>
  )
}

export default WatchLater