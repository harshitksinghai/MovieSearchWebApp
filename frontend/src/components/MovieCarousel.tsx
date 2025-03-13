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
import { Box, Typography, styled, useTheme } from "@mui/material";
import { MovieDetailsItem } from "../types/movieTypes";
import { useTranslation } from "react-i18next";

interface MovieCarouselProps {
  title: string;
  movies: MovieDetailsItem[];
}

// Styled components
const CarouselWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  position: 'relative',
}));

const CarouselBox = styled(Box)({
  position: 'relative',
  width: '100%',
});

const navigationButtonBaseSx = (theme: any) => ({
    position: "absolute",
    top: "50%",
    backgroundColor: theme.palette.customSecondary.bg,
    color: theme.palette.customSecondary.icon,
    "&:hover": {
    cursor: 'pointer',
      backgroundColor: theme.palette.customSecondary.activeBg,
      color: theme.palette.customSecondary.activeIcon,
    },
    border: "none",
    height: "48px",
    width: "48px",
    zIndex: 10,
  });
  

const prevButtonSx = {
  left: 10,
  transform: 'translateX(-45px)',
};

const nextButtonSx = {
  right: 10,
  transform: 'translateX(45px)',
  

};

const iconSx = {
  height: '32px',
  width: '32px',
};

const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, movies }) => {
    const theme = useTheme();
    const {t} = useTranslation();
  return (
    <CarouselWrapper>
        <Typography 
                variant="h2" 
                sx={{
                  fontWeight: 600,
                  fontSize: '30px',
                  color: theme.palette.text.flow,
                  ml: 2
                }}
              >
                {t(`homeList.${title}`)}
              </Typography>
      <CarouselBox>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {movies.map((movie) => (
              <CarouselItem 
                key={movie.imdbID} 
                className="pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <Box sx={{p: 2}}>
                  <MovieCard movie={movie} />
                </Box>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <Box component={CarouselPrevious} sx={{...prevButtonSx, ...navigationButtonBaseSx(theme)}}>
            <ChevronLeft style={iconSx} fill="currentColor" strokeWidth={1.5} />
          </Box>
          
          <Box component={CarouselNext} sx={{...nextButtonSx, ...navigationButtonBaseSx(theme)}}>
            <ChevronRight style={iconSx} fill="currentColor" strokeWidth={1.5} />
          </Box>
        </Carousel>
      </CarouselBox>
    </CarouselWrapper>
  );
};

export default MovieCarousel;