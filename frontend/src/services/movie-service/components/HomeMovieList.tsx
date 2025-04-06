import MovieCarousel from "./MovieCarousel";
import {
    Box,
    Typography,
    Container,
    styled,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { syncFromMyList } from "@/redux/movie/movieSlice";
import { themePalettes, useCustomTheme } from "@/context/CustomThemeProvider";

const PageContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(4, 0),
    overflow: 'hidden'
}));

const HeaderContainer = styled(Container)(({ theme }) => ({
    marginBottom: theme.spacing(6)
}));

const HomeMovieList: React.FC = () => {
    console.log("Inside HomeMovieList.tsx")

    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const myListState = useAppSelector((state) => state.movie.myListState);
    const trendingList = useAppSelector((state) => state.movie.trendingListState);
    const thrillerList = useAppSelector((state) => state.movie.thrillerListState);
    const comedyList = useAppSelector((state) => state.movie.comedyListState);
    const romanceList = useAppSelector((state) => state.movie.romanceListState);
    const loading = useAppSelector((state) => state.movie.homeListLoading);

      const { currentTheme, darkMode } = useCustomTheme();
      const getCurrentPalette = () => {
        const palette = themePalettes[currentTheme];
        return darkMode ? palette.dark : palette.light;
      };
    
      const currentPalette = getCurrentPalette();

    useEffect(() => {
        if (myListState.length > 0 && (trendingList.length > 0 || thrillerList.length > 0 || comedyList.length > 0 || romanceList.length > 0)) {
            dispatch(syncFromMyList());
        }
    }, [dispatch, myListState]);

    return (

        <PageContainer>
            <HeaderContainer>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 600,
                        fontSize: 'clamp(2rem, 5vw, 3.125rem)',
                        textAlign: 'center',
                        marginTop: '1.25rem',
                        color: currentPalette.textPrimary
                    }}
                >
                    {t('homeList.discover')}
                </Typography>
            </HeaderContainer>
            <Box sx={{ margin: 0, mb: '2.625rem', width: '90%', justifySelf: 'center', alignItems: 'center', pl: '2rem', pr: '0.8rem' }}>

                <MovieCarousel title="Trending" movies={trendingList} isLoading={loading} />
                <MovieCarousel title="Thriller" movies={thrillerList} isLoading={loading} />
                <MovieCarousel title="Comedy" movies={comedyList} isLoading={loading} />
                <MovieCarousel title="Romance" movies={romanceList} isLoading={loading} />

            </Box>

        </PageContainer>

    );
};

export default HomeMovieList;