import React from 'react';
import { Box, Button } from '@mui/material';
import { FaHeart, FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { setFavActiveRating, setFavActiveType } from '../features/filter/filterSlice.ts';
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider.tsx';

const FavListFilter: React.FC = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const activeType = useAppSelector((state) => state.filter.fav_activeType);
    const activeRating = useAppSelector((state) => state.filter.fav_activeRating);

      const { currentTheme, darkMode } = useCustomTheme();
      const getCurrentPalette = () => {
        const palette = themePalettes[currentTheme];
        return darkMode ? palette.dark : palette.light;
      };
    
      const currentPalette = getCurrentPalette();

    const updateTypeFilter = (Type: string) => {
        if (activeType !== Type) {
            dispatch(setFavActiveType(Type));
        }
    }
    const updateRatingStateFilter = (ratingState: string) => {
        const newRating = (activeRating !== ratingState) ? ratingState : "none";
        dispatch(setFavActiveRating(newRating));
    }

    const buttonSx = (isActive: boolean) => ({
        backgroundColor: isActive ? currentPalette.primary : currentPalette.secondary,
        color: (currentTheme === 'White' && darkMode) ? '#222' : '#fff',
        borderStyle: 'solid',
        borderColor: darkMode ? '#fff' : '#444',
        borderWidth: '1px',
        width: 'fit-content',
        minWidth: '45px',
        minHeight: '40px',
        display: 'flex',
        padding: '0 8px',
        alignItems: 'center',
        borderRadius: '8px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: currentPalette.textSecondary,
            color: currentTheme === 'White' && darkMode ? '#222' : '#fff',
        },
    });
    
    const buttonSpanSx = {
        paddingLeft: '8px',
    };

    return (
        <Box sx={{
            position: 'relative',
            top: '0px',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '5px',
                alignItems: 'center',
            }}>
                <Button
                    sx={buttonSx(activeType === "")}
                    onClick={() => updateTypeFilter("")}
                >
                    {t('fav.filter.typeAll')}
                </Button>
                <Button
                    sx={buttonSx(activeType === "movie")}
                    onClick={() => updateTypeFilter("movie")}
                >
                    {t('fav.filter.typeMovies')}
                </Button>
                <Button
                    sx={buttonSx(activeType === "series")}
                    onClick={() => updateTypeFilter("series")}
                >
                    {t('fav.filter.typeSeries')}
                </Button>
                <Button
                    sx={buttonSx(activeType === "game")}
                    onClick={() => updateTypeFilter("game")}
                >
                    {t('fav.filter.typeGames')}
                </Button>
                <Box sx={{
                    width: '1px',
                    height: '30px',
                    backgroundColor: darkMode ? '#fff' : '#222',
                    margin: '0 10px',
                }} />
                <Button
                    sx={buttonSx(activeRating === "love")}
                    onClick={() => updateRatingStateFilter("love")}
                >
                    {t('fav.filter.love')} <Box component="span" sx={buttonSpanSx}><FaHeart size={20} /></Box>
                </Button>
                <Button
                    sx={buttonSx(activeRating === "like")}
                    onClick={() => updateRatingStateFilter("like")}
                >
                    {t('fav.filter.like')}
                    <Box component="span" sx={{
                        ...buttonSpanSx,
                        //...button2SpanSx, (this is also valid)
                        paddingBottom: '3px',
                    }}>
                        <FaThumbsUp size={20} />
                    </Box>
                </Button>
                <Button
                    sx={buttonSx(activeRating === "dislike")}
                    onClick={() => updateRatingStateFilter("dislike")}
                >
                    {t('fav.filter.meh')} <Box component="span" sx={buttonSpanSx}><FaThumbsDown size={20} /></Box>
                </Button>
            </Box>
        </Box>
    );
};

export default FavListFilter;