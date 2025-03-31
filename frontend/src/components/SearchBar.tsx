import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Button, 
  MenuItem, 
  Typography, 
  Paper,
  IconButton,
  InputBase,
  Popover,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchSearchResults, setError, setSearchParams } from '../features/search/searchSlice';
import { themePalettes, useCustomTheme } from '../context/CustomThemeProvider';
import { Toaster, toast } from 'sonner'

const SearchBar = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:1300px)');

  const {query, year, type} = useAppSelector((state) => state.search.searchParams)
  const {error} = useAppSelector((state) => state.search);
  
  const [typeAnchorEl, setTypeAnchorEl] = useState<null | HTMLElement>(null);
  const [yearAnchorEl, setYearAnchorEl] = useState<null | HTMLElement>(null);
  const isTypeOpen = Boolean(typeAnchorEl);
  const isYearOpen = Boolean(yearAnchorEl);

  useEffect(() => {
    if(error){
      toast.error(t(`error.${error}`));
    }
  })

  const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  const currentPalette = getCurrentPalette();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1887 }, (_, i) => currentYear - i);

  const handleSearchButton = () => {
    if (query.trim().length < 3) {
      dispatch(setError('titleError'));
      return;
    }
    dispatch(setError(null));
    dispatch(fetchSearchResults({query: query.trim(), year, type}));
  };

  const handleTypeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTypeAnchorEl(event.currentTarget);
  };

  const handleYearClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setYearAnchorEl(event.currentTarget);
  };

  const handleTypeClose = () => {
    setTypeAnchorEl(null);
  };

  const handleYearClose = () => {
    setYearAnchorEl(null);
  };

  let typeOption: string;
  if (type === 'movie') {
    typeOption = t('navbar.typeMovies');
  } else if (type === 'series') {
    typeOption = t('navbar.typeSeries');
  } else if (type === 'game') {
    typeOption = t('navbar.typeGames');
  } else {
    typeOption = t('navbar.typeAll');
  }

  const popoverStyles = {
    '& .MuiPaper-root': {
      backgroundColor: '#222222',
      color: 'white',
      maxHeight: '320px',
      overflowY: 'auto',
      borderRadius: '8px',
      marginTop: '2px',
      '&::-webkit-scrollbar': {
        width: '8px'
      },
      '&::-webkit-scrollbar-track': {
        background: '#2a2a2a',
        borderRadius: '4px'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#444444',
        borderRadius: '4px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#424242'
      }
    }
  };

  const buttonStyles = {
    height: '2.4rem',
    backgroundColor: currentPalette.primary,
    color: currentTheme === 'White' && darkMode ? '#222' : '#fff',
    padding: '0 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
      backgroundColor: currentPalette.secondary,
    },
    textTransform: 'none',
    minWidth: isMobile ? '60px' : '80px',
    fontSize: isMobile ? '0.75rem' : 'inherit'
  };

  const menuItemStyles = {
    '&:hover': {
      backgroundColor: currentPalette.secondary,
    },
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      marginRight: isMobile ? '0' : { xs: '0', sm: '2rem', md: '6.25rem' },
      width: isMobile ? '100%' : 'auto'
    }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '34rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: currentPalette.background,
          borderRadius: '0.5rem',
          paddingLeft: '0.375rem',
          gap: '0.125rem',
          border: error ? '2px solid rgb(247, 87, 87)' : 'none',
          color: theme.palette.text.secondary
        }}
      >
        <InputBase
          placeholder={t('navbar.searchPlaceholder')}
          value={query}
          onChange={(e) => {
            dispatch(setError(null));
            dispatch(setSearchParams({query: e.target.value, year, type}));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchButton();
            }
          }}
          sx={{
            width: '100%',
            height: '90%',
            pl: 1,
            '& .MuiInputBase-input': {
              height: '100%'
            }
          }}
        />

        <Box sx={{ 
          height: '90%', 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: currentPalette.background,
          gap: '0.125rem', 
          width: 'fit-content',
          flexWrap: { xs: 'nowrap', sm: 'nowrap' }
        }}>
          <Button
            id="type-button"
            aria-controls={isTypeOpen ? 'type-popover' : undefined}
            aria-haspopup="true"
            aria-expanded={isTypeOpen ? 'true' : undefined}
            onClick={handleTypeClick}
            sx={{
              ...buttonStyles,
              minWidth: isMobile ? '4rem' : '5rem',
            }}
            endIcon={isTypeOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            {isMobile && type ? type.charAt(0).toUpperCase() + type.slice(1, 3) : 
             isMobile && !type ? t('navbar.typeAll').substring(0, 3) : typeOption}
          </Button>
          
          <Popover
            id="type-popover"
            open={isTypeOpen}
            anchorEl={typeAnchorEl}
            onClose={handleTypeClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={popoverStyles}
          >
            <Box>
              {[
                { label: t('navbar.typeAll'), value: '' },
                { label: t('navbar.typeMovies'), value: 'movie' },
                { label: t('navbar.typeSeries'), value: 'series' },
                { label: t('navbar.typeGames'), value: 'game' }
              ].map((option) => (
                <MenuItem 
                  key={option.label} 
                  onClick={() => {
                    dispatch(setSearchParams({query, year, type: option.value}));
                    handleTypeClose();
                  }}
                  sx={menuItemStyles}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Box>
          </Popover>

          <Button
            id="year-button"
            aria-controls={isYearOpen ? 'year-popover' : undefined}
            aria-haspopup="true"
            aria-expanded={isYearOpen ? 'true' : undefined}
            onClick={handleYearClick}
            sx={{
              ...buttonStyles,
              minWidth: isMobile ? '3.5rem' : '5rem',
            }}
            endIcon={isYearOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            {year ? (isMobile ? "'" + year.slice(2) : year) : t('navbar.Year')}
          </Button>
          
          <Popover
            id="year-popover"
            open={isYearOpen}
            anchorEl={yearAnchorEl}
            onClose={handleYearClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={popoverStyles}
          >
            <Box>
              <MenuItem 
                onClick={() => {
                  dispatch(setSearchParams({query, year: '', type}));
                  handleYearClose();
                }}
                sx={{
                  minWidth: '76px',
                  ...menuItemStyles
                }}
              >
                {t('navbar.none')}
              </MenuItem>
              {years.map((yearOption) => (
                <MenuItem 
                  key={yearOption} 
                  onClick={() => {
                    dispatch(setSearchParams({query, year: yearOption.toString(), type}));
                    handleYearClose();
                  }}
                  sx={{
                    minWidth: '76px',
                    ...menuItemStyles
                  }}
                >
                  {yearOption}
                </MenuItem>
              ))}
            </Box>
          </Popover>

          <IconButton
            onClick={handleSearchButton}
            sx={{
              backgroundColor: currentPalette.primary,
              color: currentTheme === 'White' && darkMode ? '#222' : '#fff',
              borderRadius: '6px',
              height: '2.4rem',
              width: '2.5rem',
              padding: '0 10px',
              '&:hover': {
                backgroundColor: currentPalette.secondary,
                cursor: 'pointer'
              }
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default SearchBar;