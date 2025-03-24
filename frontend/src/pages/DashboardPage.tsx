import Navbar from "@/components/Navbar";
import { Box, Button, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { PiClockCountdownFill } from "react-icons/pi";
import { JSX, memo, useMemo } from "react";
import MainBarChart from "../components/MainBarChart";
import { Link, useNavigate } from "react-router-dom";
import GenreBarGraph from "../components/GenreBarGraph";
import RatingPieChart from "@/components/RatingPieChart";
import { useAppSelector } from "@/app/hooks";
import { genreChartDataFilter, lastThirtyDaysTimeWatchedFilter, ratingChartDataFilter, recentFavouritesFilter, reWatchesFilter, totalLovedTimeWatchedFilter, totalTimeWatchedFilter, totalWatchedCountFilter, yearlyTimeWatchedFilter } from "@/features/filter/filterSlice";
import { FaHeart } from "react-icons/fa6";
import { themePalettes, useCustomTheme } from "@/context/CustomThemeProvider";
import { useTranslation } from "react-i18next";

interface StatsBoxProps {
    title: string;
    primary: string;
    secondary: string;
    icon: JSX.Element
}

// StatsBox is already correctly memoized
const StatsBox: React.FC<StatsBoxProps> = memo(({ title, primary, secondary, icon }) => {
    const { currentTheme, darkMode } = useCustomTheme();
    const getCurrentPalette = () => {
      const palette = themePalettes[currentTheme];
      return darkMode ? palette.dark : palette.light;
    };
  
    const currentPalette = getCurrentPalette();
    return (
        <Paper
            elevation={2}
            sx={{
                height: "120px",
                borderRadius: "8px",
                pt: "1rem",
                pl: "1.5rem",
                bgcolor: currentTheme === 'White' && !darkMode ? '#fff' : currentPalette.paper
            }}
        >
            <Stack flexDirection={"column"} sx={{ position: "relative" }}>
                <Typography sx={{ fontWeight: "600", color: currentPalette.textPrimary }}>{title}</Typography>
                <Typography sx={{ fontSize: "30px", fontWeight: "800", color: currentPalette.textPrimary }}>
                    {primary}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: darkMode ? '#ededed' : '#525252' }}>
                    {secondary}
                </Typography>
                <Box
                    sx={{
                        position: "absolute",
                        top: "-2px",
                        right: "1rem",
                    }}
                >
                    {icon}
                </Box>
            </Stack>
        </Paper>
    );
});

interface MediaItemProps {
  item: {
    imdbID: string;
    Title: string;
    Type: string;
    year: string;
  },
}

// Use the interface in the component definition
const MediaItem = ({ item }: MediaItemProps) => {
    const { currentTheme, darkMode } = useCustomTheme();
    const getCurrentPalette = () => {
      const palette = themePalettes[currentTheme];
      return darkMode ? palette.dark : palette.light;
    };
  
    const currentPalette = getCurrentPalette();

    return (
    <Link to={`/movie/${item.imdbID}`}>
        <Stack
            direction="row"
            sx={{
                height: 'auto',
                p: '4px',
                borderBottomWidth: '2px',
                borderColor: currentPalette.background
            }}
        >
            <Typography sx={{ 
                maxWidth: '70%', 
                fontWeight: '500',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.4em',
                maxHeight: '2.8em',
                color: darkMode ? '#ededed' : '#525252'
            }}>
                {item.Title}
            </Typography>
            <Box sx={{
                maxWidth: '30%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'end',
                marginLeft: 'auto'
            }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#ededed' : '#525252' }}>{item.Type.toUpperCase()}</Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#ededed' : '#525252' }}>{item.year}</Typography>
            </Box>
        </Stack>
    </Link>
    )
};

const DashboardPage = () => {

    const {t} = useTranslation();

      const { currentTheme, darkMode } = useCustomTheme();
      const getCurrentPalette = () => {
        const palette = themePalettes[currentTheme];
        return darkMode ? palette.dark : palette.light;
      };
    
      const currentPalette = getCurrentPalette();

    const statisticsSx = useMemo(() => ({
        height: 'auto',
        borderRadius: '8px',
        p: "1rem",
    }), []);

    // Selectors from Redux store
    const totalTimeWatched = useAppSelector(totalTimeWatchedFilter);
    const totalLovedTimeWatched = useAppSelector(totalLovedTimeWatchedFilter);
    const lastThirtyDaysTimeWatched = useAppSelector(lastThirtyDaysTimeWatchedFilter);
    const totalWatchedCount = useAppSelector(totalWatchedCountFilter);
    const yearlyTimeWatchedChartData = useAppSelector(yearlyTimeWatchedFilter);
    const { genreChartData, genreChartConfig } = useAppSelector(genreChartDataFilter);
    const ratingChartData = useAppSelector(ratingChartDataFilter);
    const recentFavourites = useAppSelector(recentFavouritesFilter);
    const reWatches = useAppSelector(reWatchesFilter);

    const navigate = useNavigate();

    return (
        <>
            <Navbar isSearchBar={false} />
            <Box sx={{
                position: "absolute",
                top: '5.5rem',
                left: '10%',
                right: '10%',
                pb: '5%'
            }}>
                <Grid container spacing={2}>
                    <Grid size={3}>
                        <StatsBox
                            title={t('dashboard.totalTimeWatched')}
                            primary={`${totalTimeWatched.totalHours}hrs`}
                            secondary={`${t('dashboard.Movies')}: ${totalTimeWatched.totalMoviesHours}hrs, ${t('dashboard.Series')}: ${totalTimeWatched.totalSeriesHours}hrs`}
                            icon={<TimelapseIcon sx={{color: currentPalette.textPrimary}} />}
                        />
                    </Grid>
                    <Grid size={3}>
                        <StatsBox
                            title={t('dashboard.bestMemories')}
                            primary={`${totalLovedTimeWatched.totalLovedHours}hrs`}
                            secondary={`${t('dashboard.Movies')}: ${totalLovedTimeWatched.totalLovedMoviesHours}hrs, ${t('dashboard.Series')}: ${totalLovedTimeWatched.totalLovedSeriesHours}hrs`}
                            icon={<FaHeart size={20} color={currentPalette.textPrimary} />}
                        />
                    </Grid>
                    <Grid size={3}>
                        <StatsBox
                            title={t('dashboard.theLast') + " 30 " + t('dashboard.days')}
                            primary={`${lastThirtyDaysTimeWatched.lastThirtyDaysHours}hrs`}
                            secondary={`${t('dashboard.Movies')}: ${lastThirtyDaysTimeWatched.lastThirtyDaysMoviesHours}hrs, ${t('dashboard.Series')}: ${lastThirtyDaysTimeWatched.lastThirtyDaysSeriesHours}hrs`}
                            icon={<TimelapseIcon sx={{color: currentPalette.textPrimary}} />}
                        />
                    </Grid>
                    <Grid size={3}>
                        <StatsBox
                            title={t('dashboard.totalWatchedCount')}
                            primary={`${totalWatchedCount.totalWatchedCount}`}
                            secondary={`${t('dashboard.Movies')}: ${totalWatchedCount.totalMoviesWatchedCount}, ${t('dashboard.Series')}: ${totalWatchedCount.totalSeriesWatchedCount}`}
                            icon={<PiClockCountdownFill size={25} color={currentPalette.textPrimary} />}
                        />
                    </Grid>

                    {/* Overview */}
                    <Grid size={8}>
                        <Paper elevation={2} sx={{
                            ...statisticsSx,
                        }}>
                            <MainBarChart chartData={yearlyTimeWatchedChartData} />
                        </Paper>
                    </Grid>

                    {/* Recent Favourites */}
                    <Grid size={4}>
                        <Paper elevation={2} sx={{
                            ...statisticsSx,
                            position: 'relative',
                            height: '100%',
                            minHeight: '480px'
                        }}>
                            <Stack flexDirection={'column'} gap={0} sx={{
                                height: '100%',
                                position: 'relative'
                            }}>
                                <Typography sx={{ fontWeight: '600', color: currentPalette.textPrimary }}>{t('dashboard.recentFavourites')}</Typography>
                                {recentFavourites.length > 0 ? (
                                    <>
                                        <Typography sx={{ color: darkMode ? '#ededed' : '#525252', fontSize: '15px' }}>
                                            {t('dashboard.youCurrentlyHave')} {totalWatchedCount.totalWatchedCount} {(recentFavourites.length === 1) ? t('dashboard.favourite') : t('dashboard.favourites')}
                                        </Typography>
                                        <Stack direction={'column'} gap={1} sx={{pt: '8px', flexGrow: 1, overflow: 'auto'}}>
                                            {recentFavourites.map((item) => (
                                                <MediaItem key={item.imdbID} item={item} />
                                            ))}
                                            {totalWatchedCount.totalWatchedCount > recentFavourites.length && (
                                                <Button 
                                                    onClick={() => navigate('/mylist')} 
                                                    variant="contained" 
                                                    sx={{position: "absolute", bottom: '0', width: '92%', alignSelf: 'center'}}
                                                >
                                                    {t('dashboard.viewMore')}
                                                </Button>
                                            )}
                                        </Stack>
                                    </>
                                ) : (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        translate: '-50% -50%'
                                    }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Typography sx={{color: darkMode ? '#ededed' : '#525252'}}>{t('dashboard.noRecentFavourites')}</Typography>
                                            <Typography sx={{color: darkMode ? '#ededed' : '#525252'}}>{t('dashboard.goTo')}
                                                <Link
                                                    to={'/home'}
                                                    style={{
                                                        fontStyle: 'italic',
                                                        fontWeight: 600,
                                                        color: 'rgb(5, 205, 5)'
                                                    }}
                                                >
                                                    <span> </span>{t('dashboard.home')}
                                                </Link>
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Stack>
                        </Paper>
                    </Grid>
                    
                    {/* Rating Pie Chart */}
                    <Grid size={3}>
                        <Paper elevation={2} sx={{
                            ...statisticsSx,
                            position: 'relative',
                            height: '100%',
                        }}>
                            <RatingPieChart chartData={ratingChartData} />
                        </Paper>
                    </Grid>
                    
                    {/* Genre Bar Graph */}
                    <Grid size={6}>
                        <Paper elevation={2} sx={{
                            ...statisticsSx,
                            position: 'relative',
                            minHeight: '380px'
                        }}>
                            <GenreBarGraph chartData={genreChartData} chartConfig={genreChartConfig} />
                        </Paper>
                    </Grid>
                    
                    {/* Due a re-watch */}
                    <Grid size={3}>
                        <Paper elevation={2} sx={{
                            ...statisticsSx,
                            position: 'relative',
                            height: '100%',
                        }}>
                            <Stack flexDirection={'column'} gap={0} sx={{
                                position: 'relative',
                                height: '100%'
                            }}>
                                <Typography sx={{ fontWeight: '600', color: currentPalette.textPrimary }}>{t('dashboard.dueAReWatch')}</Typography>
                                {reWatches.totalReWatches > 0 ? (
                                    <>
                                        <Typography sx={{ color: darkMode ? '#ededed' : '#525252', fontSize: '15px' }}>
                                        {t('dashboard.youCurrentlyHave')} {reWatches.totalReWatches} {(reWatches.totalReWatches === 1) ? t('dashboard.reWatch') + " " + t('dashboard.due') : t('dashboard.reWatches') + " " + t('dashboard.due')}
                                        </Typography>
                                        <Stack direction={'column'} gap={1} sx={{pt: '8px', flexGrow: 1, overflow: 'auto'}}>
                                            {reWatches.reWatches.map((item) => (
                                                <MediaItem key={item.imdbID} item={item} />
                                            ))}
                                            {reWatches.totalReWatches > reWatches.reWatches.length && (
                                                <Button 
                                                    onClick={() => navigate('/watchlater')} 
                                                    variant="contained" 
                                                    sx={{position: "absolute", bottom: '0', width: '92%', alignSelf: 'center'}}
                                                >
                                                    {t('dashboard.viewMore')}
                                                </Button>
                                            )}
                                        </Stack>
                                    </>
                                ) : (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        translate: '-50% -50%'
                                    }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Typography sx={{color: darkMode ? '#ededed' : '#525252'}}>{t('dashboard.noReWatchDue')}</Typography>
                                            <Typography sx={{color: darkMode ? '#ededed' : '#525252'}}>{t('dashboard.goTo')}
                                                <Link
                                                    to={'/watchlater'}
                                                    style={{
                                                        fontStyle: 'italic',
                                                        fontWeight: 600,
                                                        color: 'rgb(5, 205, 5)'
                                                    }}
                                                >
                                                    <span> </span>{t('dashboard.watchLater')}
                                                </Link>
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default DashboardPage;