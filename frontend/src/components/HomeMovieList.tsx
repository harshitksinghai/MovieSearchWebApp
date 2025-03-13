import MovieCarousel from "./MovieCarousel";
import {
    Box,
    Typography,
    Container,
    styled,
    useTheme,
    Skeleton
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { syncFromMyList } from "@/features/movie/movieSlice";

const PageContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(4, 0),
    overflow: 'hidden'
}));

const HeaderContainer = styled(Container)(({ theme }) => ({
    marginBottom: theme.spacing(6)
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100vw',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    padding: theme.spacing(0, 6),
    marginBottom: theme.spacing(-5)
}));

const SkeletonCarouselContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100vw',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    padding: theme.spacing(0, 6),
    marginBottom: theme.spacing(6)
}));

const HomeMovieList: React.FC = () => {
    console.log("Inside HomeMovieList.tsx")

    const theme = useTheme();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const myListState = useAppSelector((state) => state.movie.myListState);
    const trendingList = useAppSelector((state) => state.movie.trendingListState);
    const thrillerList = useAppSelector((state) => state.movie.thrillerListState);
    const comedyList = useAppSelector((state) => state.movie.comedyListState);
    const romanceList = useAppSelector((state) => state.movie.romanceListState);
    const loading = useAppSelector((state) => state.movie.loading);

    useEffect(() => {
        if(myListState.length > 0 && (trendingList.length > 0 || thrillerList.length > 0 || comedyList.length > 0 || romanceList.length > 0)){
            dispatch(syncFromMyList());
        }
    }, [dispatch, myListState]);

    const SkeletonCarousel = (props: { title: string }) => (
        <SkeletonCarouselContainer>
            <Typography
                variant="h2"
                sx={{
                    fontWeight: 600,
                    fontSize: '30px',
                    color: theme.palette.text.flow,
                    ml: 2,
                    mb: '15px'
                }}
            >
                {t(`homeList.${props.title}`)}
            </Typography>
            <Box sx={{
                display: 'flex',
                gap: '38px',
                overflow: 'hidden',
                ml: '18px'
            }}>
                {[...Array(5)].map((_, index) => (
                    <Skeleton
                        key={index}
                        variant="rectangular"
                        width="250px"
                        height={300}
                        sx={{
                            bgcolor: 'grey.700',
                            borderRadius: '8px',
                            flexShrink: 0
                        }}
                    />
                ))}
            </Box>
        </SkeletonCarouselContainer>
    );

    return (
        <PageContainer>
            <HeaderContainer maxWidth="lg">
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
                    {t('homeList.discover')}
                </Typography>
            </HeaderContainer>

            {loading ? (
                <>
                    <SkeletonCarousel title="Trending" />
                    <SkeletonCarousel title="Thriller" />
                    <SkeletonCarousel title="Comedy" />
                    <SkeletonCarousel title="Romance" />
                </>
            ) : (
                <>
                    {trendingList.length > 0 && (
                        <CarouselContainer>
                            <MovieCarousel title="Trending" movies={trendingList} />
                        </CarouselContainer>
                    )}

                    {thrillerList.length > 0 && (
                        <CarouselContainer>
                            <MovieCarousel title="Thriller" movies={thrillerList} />
                        </CarouselContainer>
                    )}

                    {comedyList.length > 0 && (
                        <CarouselContainer>
                            <MovieCarousel title="Comedy" movies={comedyList} />
                        </CarouselContainer>
                    )}

                    {romanceList.length > 0 && (
                        <CarouselContainer>
                            <MovieCarousel title="Romance" movies={romanceList} />
                        </CarouselContainer>
                    )}
                </>
            )}
        </PageContainer>
    );
};

export default HomeMovieList;