import React from "react";
import { Box, Card, CardMedia, CardContent, Typography, Skeleton, Pagination } from "@mui/material";
import placeholder from "../assets/placeholder1.jpg";

interface ShowMoviesProps {
    movies: any[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const ShowMovies: React.FC<ShowMoviesProps> = ({
    movies,
    loading,
    error,
    page,
    totalPages,
    onPageChange
}) => {
    return (
        <>
            {loading && (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: 2
                    }}
                >
                    {[...Array(10)].map((_, index) => (
                        <Skeleton key={index} variant="rectangular" height={400} />
                    ))}
                </Box>
            )}

            {!loading && error && (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            )}

            {!loading && !error && (
                <>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: 2
                        }}
                    >
                        {movies.map((movie) => (
                            <Card
                                key={movie.imdbID}
                                sx={{
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        zIndex: 1
                                    }
                                }}>
                                <CardMedia
                                    component="img"
                                    image={movie.Poster !== "N/A" ? movie.Poster : placeholder}
                                    alt={movie.Title}
                                    sx={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '300px',
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h6" noWrap>{movie.Title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {movie.Year} - {movie.Type.toUpperCase()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={onPageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </>
    );
};

export default ShowMovies;
