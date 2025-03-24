import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Box, Typography, styled, Skeleton } from "@mui/material";
import { MovieDetailsItem } from "../types/movieTypes";
import { useTranslation } from "react-i18next";
import { memo, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { type EmblaOptionsType } from 'embla-carousel';
import { themePalettes, useCustomTheme } from "@/context/CustomThemeProvider";

interface MovieCarouselProps {
  title: string;
  movies: MovieDetailsItem[];
  isLoading?: boolean;
  skeletonCount?: number;
}

interface currentPalette {
  primary: string;
  secondary: string;
  background: string;
  paper: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  chartColors: string[];
}

const CarouselWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  position: 'relative',
}));

const CarouselBox = styled(Box)({
  position: 'relative',
  width: '100%',
});

const navigationButtonBaseSx = (currentPalette: currentPalette) => ({
  position: "absolute",
  top: "50%",
  backgroundColor: currentPalette.background,
  color: currentPalette.textPrimary,
  "&:hover": {
    cursor: 'pointer',
    backgroundColor: currentPalette.textPrimary,
    color: currentPalette.background,
  },
  border: "none",
  height: "3rem",
  width: "3rem",
  zIndex: 10,
});

const prevButtonSx = {
  left: '0.625rem',
  transform: 'translateX(-2.8rem)',
};

const nextButtonSx = {
  right: '0.625rem',
  transform: 'translateX(2.8rem)',
};

const iconSx = {
  height: '2rem',
  width: '2rem',
};


const CARD_GAP = 25;

const MovieCardSkeleton = memo(() => {

  const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  const currentPalette = getCurrentPalette();
  
  return (
    <Box sx={{ 
      width: 250, 
      height: 375, 
      borderRadius: 2,
      overflow: 'hidden',
      bgcolor: currentPalette.paper
    }}>
      {/* Poster skeleton */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={375}
        animation="wave"
      />
    </Box>
  );
});

MovieCardSkeleton.displayName = 'MovieCardSkeleton';

const CarouselItemWrapper = memo(({ 
  index, 
  totalItems, 
  children 
}: { 
  index: number, 
  totalItems: number, 
  children: React.ReactNode 
}) => {
  return (
    <CarouselItem 
      className="pl-0"
      style={{ 
        flex: "0 0 250px",
        width: "250px",
        maxWidth: "250px",
        minWidth: "250px",
        padding: 0,
        ...(index === totalItems - 1 ? { marginRight: `${CARD_GAP}px` } : {})
      }}
    >
      <Box sx={{p: 2, pl: '4px'}}>
        {children}
      </Box>
    </CarouselItem>
  );
});

CarouselItemWrapper.displayName = 'CarouselItemWrapper';

const MovieCarousel: React.FC<MovieCarouselProps> = memo(({ 
  title, 
  movies,
  isLoading = false,
  skeletonCount = 15 
}) => {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [slidesToShow, setSlidesToShow] = useState(4);

        const { currentTheme, darkMode } = useCustomTheme();
        const getCurrentPalette = () => {
          const palette = themePalettes[currentTheme];
          return darkMode ? palette.dark : palette.light;
        };
      
        const currentPalette = getCurrentPalette();
  
  const skeletonItems = useMemo(() => 
    Array.from({ length: skeletonCount }, (_, index) => index), 
    [skeletonCount]
  );
  
  const prevButtonStyles = useMemo(() => ({ 
    ...prevButtonSx, 
    ...navigationButtonBaseSx(currentPalette) 
  }), [currentPalette]);
  
  const nextButtonStyles = useMemo(() => ({ 
    ...nextButtonSx, 
    ...navigationButtonBaseSx(currentPalette) 
  }), [currentPalette]);
  
  const titleStyles = useMemo(() => ({
    fontWeight: 600,
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    color: currentPalette.textPrimary,
    ml: '0.75rem'
  }), [currentPalette.textPrimary]);
  
  const calculateSlidesToShow = useCallback(() => {
    if (!carouselRef.current) return;
    
    const containerWidth = carouselRef.current.offsetWidth;
    const cardWidth = 250; 
    const totalCardWidth = cardWidth + CARD_GAP; 
    
    const calculatedSlides = Math.floor(containerWidth / totalCardWidth);
    
    const newSlidesToShow = Math.max(1, Math.min(calculatedSlides, movies.length));
    
    if (newSlidesToShow !== slidesToShow) {
      setSlidesToShow(newSlidesToShow);
    }
  }, [movies.length, slidesToShow]);
  
  const handleResize = useCallback(() => {
    let resizeTimer: NodeJS.Timeout;
    
    return () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        calculateSlidesToShow();
      }, 100); 
    };
  }, [calculateSlidesToShow]);
  
  useEffect(() => {
    calculateSlidesToShow();
    
    const resizeListener = handleResize();
    window.addEventListener('resize', resizeListener);
    
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [calculateSlidesToShow, handleResize]);
  
  const carouselOpts = useMemo<EmblaOptionsType>(() => ({
    align: "start",
    loop: true
  }), []);
  
  const carouselContentStyle = useMemo(() => ({
    gap: `${CARD_GAP}px`,
    display: 'flex'
  }), []);
  
  const renderSkeletons = useMemo(() => (
    skeletonItems.map((index) => (
      <CarouselItemWrapper 
        key={`skeleton-${index}`}
        index={index}
        totalItems={skeletonItems.length}
        
        

      >
        <MovieCardSkeleton />
      </CarouselItemWrapper>
    ))
  ), [skeletonItems]);
  
  const renderMovies = useMemo(() => (
    movies.map((movie, index) => (
      <CarouselItemWrapper 
        key={movie.imdbID || index}
        index={index}
        totalItems={movies.length}
      >
        <MovieCard movie={movie} />
      </CarouselItemWrapper>
    ))
  ), [movies]);
  
  return (
    <CarouselWrapper>
      <Typography 
        variant="h2" 
        sx={titleStyles}
      >
        {isLoading ? (
          <Skeleton style={{backgroundColor: currentPalette.paper}} variant="text" width={200} height={40} animation="wave" />
        ) : (
          t(`homeList.${title}`)
        )}
      </Typography>
      
      <CarouselBox ref={carouselRef}>
        <Carousel
          opts={carouselOpts}
          className="w-full"
        >
          <CarouselContent 
            className="-ml-0"
            style={carouselContentStyle}
          >
            {isLoading ? renderSkeletons : renderMovies}
          </CarouselContent>
          
          <Box component={CarouselPrevious} sx={prevButtonStyles}>
            <ChevronLeft style={iconSx} fill="currentColor" strokeWidth={1.5} />
          </Box>
          
          <Box component={CarouselNext} sx={nextButtonStyles}>
            <ChevronRight style={iconSx} fill="currentColor" strokeWidth={1.5} />
          </Box>
        </Carousel>
      </CarouselBox>
    </CarouselWrapper>
  );
});

MovieCarousel.displayName = 'MovieCarousel';

export default MovieCarousel;