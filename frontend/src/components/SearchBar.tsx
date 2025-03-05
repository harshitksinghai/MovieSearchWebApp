import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useSearch } from '../context/SearchContext';
import { 
  Box, 
  Button, 
  MenuItem, 
  Typography, 
  Paper,
  IconButton,
  InputBase,
  Popover
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const SearchBar = () => {
  const { handleSearch, error, handleError, title, handleTitle } = useSearch();
  const { t } = useTranslation();
  const theme = useTheme();
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  
  const [typeAnchorEl, setTypeAnchorEl] = useState<null | HTMLElement>(null);
  const [yearAnchorEl, setYearAnchorEl] = useState<null | HTMLElement>(null);
  const isTypeOpen = Boolean(typeAnchorEl);
  const isYearOpen = Boolean(yearAnchorEl);

  useEffect(() => {
    handleTitle('');
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1887 }, (_, i) => currentYear - i);

  const handleSearchButton = () => {
    if (title.trim().length < 3) {
      handleError(t('error.titleError'));
      return;
    }
    handleError('');
    handleSearch(title, year, type);
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
    height: '38px',
    backgroundColor: '#222222',
    color: 'white',
    padding: '0 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
      backgroundColor: '#424242',

    },
    textTransform: 'none',
    minWidth: '80px'
  };

  const menuItemStyles = {
    '&:hover': {
      backgroundColor: '#424242',

    }
  };

  return (
    <Box sx={{ position: 'relative', marginRight: '100px' }}>
      <Paper
        elevation={0}
        sx={{
          width: '550px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderRadius: '8px',
          paddingLeft: '6px',
          gap: '2px',
          border: error ? '2px solid rgb(247, 87, 87)' : 'none',
          color: theme.palette.text.secondary
        }}
      >
        <InputBase
          placeholder={t('navbar.searchPlaceholder')}
          value={title}
          onChange={(e) => {
            if (e.target.value === '') {
              handleError(null);
            }
            handleTitle(e.target.value);
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
          backgroundColor: 'white',
          gap: '2px', 
          width: 'fit-content',
        }}>
          <Button
            id="type-button"
            aria-controls={isTypeOpen ? 'type-popover' : undefined}
            aria-haspopup="true"
            aria-expanded={isTypeOpen ? 'true' : undefined}
            onClick={handleTypeClick}
            sx={{
              ...buttonStyles,
              minWidth: '82px',
            }}
            endIcon={isTypeOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            {typeOption}
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
                    setType(option.value);
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
            sx={buttonStyles}
            endIcon={isYearOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            {year ? year : t('navbar.Year')}
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
                  setYear('');
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
                    setYear(yearOption.toString());
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
              backgroundColor: '#222222',
              color: 'white',
              borderRadius: '6px',
              height: '38px',
              width: '40px',
              padding: '0 10px',
              '&:hover': {
                backgroundColor: '#424242',
                cursor: 'pointer'
              }
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Paper>
      
      {error && (
        <Typography 
          sx={{ 
            fontSize: '13px',
            marginLeft: '7px',
            color: 'red',
            position: 'absolute',
            bottom: '-18px',
            left: 0,
            width: '100%',
            textAlign: 'left'
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default SearchBar;