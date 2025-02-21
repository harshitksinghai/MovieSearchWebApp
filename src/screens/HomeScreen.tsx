import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";
import ShowMovies from "../components/ShowMovies";
import { fetchMovies } from "../api/api";
import HomeMovieList from "../components/HomeMovieList";

const HomeScreen: React.FC = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchParams, setSearchParams] = useState<any>({ query: "", year: "", type: "" });
    const [searchState, setSearchState] = useState<boolean>(false);

    useEffect(() => {
        fetchHomeMovieList();
    }, []);

    useEffect(() => {
        if (searchParams.query.trim() === "" && 
            searchParams.year.trim() === "" && 
            searchParams.type === "") {
            setSearchState(false);
        }
    }, [searchParams]);

    const fetchHomeMovieList = async () => {
        setLoading(true);
        try {
            const moviesResult = await fetchMovies("", "", "movie");
            const seriesResult = await fetchMovies("", "", "series");
    
            const combinedMovies = [
                ...(moviesResult.movies || []),
                ...(seriesResult.movies || [])
            ];
    
            setMovies(combinedMovies);
            setError(null);
        } catch (err) {
            console.error('Error fetching home movie list:', err);
            setError("Failed to fetch home movie list.");
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMovieResults = async (query: string, year: string, type: string, currentPage: number = 1) => {
        if (!query && !year && !type) {
            setError("Enter a title, year or type to search");
            setMovies([]);
            setSearchState(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await fetchMovies(query, year, type, currentPage);
            setMovies(result.movies || []);
            setTotalPages(result.totalPages);
            setError(result.error);
        } catch (err) {
            console.error('Search Error:', err);
            setError("Something went wrong");
            setMovies([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string, year: string, type: string) => {
        setSearchParams({ query, year, type });
        setSearchState(true);

        if (query.trim().length < 3 && query.trim().length > 0) {
            setError("Title must have 3 or more characters!");
            return;
        }

        if (year.trim()) {
            const yearNum = parseInt(year);
            const currentYear = new Date().getFullYear();
            
            if (yearNum < 1888 || yearNum > currentYear) {
                setError(`Year must be between 1888 and ${currentYear}`);
                return;
            }
        }

        if (!query.trim() && !year.trim() && !type) {
            setSearchState(false);
            fetchHomeMovieList();
            return;
        }

        
        setPage(1);
        fetchMovieResults(query, year, type, 1);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        fetchMovieResults(searchParams.query, searchParams.year, searchParams.type, value);
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                🎬 Movie Search App
            </Typography>
            <SearchBar 
                onSearch={handleSearch}
                initialValues={searchParams}
            />
            {!searchState && (
                <HomeMovieList movies={movies} loading={loading} />
            )}
            {searchState && (
                <ShowMovies
                    movies={movies}
                    loading={loading}
                    error={error}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </Container>
    );
};

export default HomeScreen;