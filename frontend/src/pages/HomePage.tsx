

import SearchResults from "../components/SearchResults";
import MovieCarousel from "../components/MovieCarousel.tsx";
import { useSearch } from '../context/SearchContext';
import { useEffect } from "react";
import Navbar from "../components/Navbar.tsx";

const HomePage = () => {
    const { 
        movies, 
        loading, 
        error, 
        page, 
        totalPages, 
        searchState, 
        handleSearchState,
        handlePageChange 
    } = useSearch();

    useEffect(() => {
        handleSearchState(false);
    }, []);
    return (
        <div>
            <Navbar isSearchBar={true}/>
            {!searchState && (
                <MovieCarousel />
            )}
            {searchState && (
                <SearchResults
                    movies={movies}
                    loading={loading}
                    error={error}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default HomePage;
