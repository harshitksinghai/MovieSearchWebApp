import React, { useState, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import placeholder from '../assets/placeholder1.jpg';

interface Movie {
    Title: string;
    Year: string;
    Poster: string;
    Type: string;
    imdbID: string;
}

interface MovieCarouselProps {
    title: string;
    movies: Movie[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, movies }) => {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -800 : 800;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            setShowLeftArrow(scrollContainerRef.current.scrollLeft > 0);
        }
    };

    return (
        <Box sx={{ position: 'relative', mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
                {title}
            </Typography>
            
            <Box sx={{ position: 'relative' }}>
                {showLeftArrow && (
                    <IconButton
                        onClick={() => scroll('left')}
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                            }
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>
                )}
                
                <IconButton
                    onClick={() => scroll('right')}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                        }
                    }}
                >
                    <ChevronRight />
                </IconButton>

                <Box
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        },
                        gap: 2,
                        px: 2
                    }}
                >
                    {movies.map((movie) => (
                        <Box
                            key={movie.imdbID}
                            sx={{
                                minWidth: 200,
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    zIndex: 1
                                }
                            }}
                        >
                            <img
                                src={movie.Poster !== "N/A" ? movie.Poster : placeholder}
                                alt={movie.Title}
                                style={{
                                    width: '200px',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }}
                            />
                            <Typography variant="subtitle1" noWrap sx={{ mt: 1 }}>
                                {movie.Title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {movie.Year}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default MovieCarousel;