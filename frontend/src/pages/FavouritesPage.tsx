

import SearchResults from "../components/SearchResults";
import Favourites from "../components/Favourites.tsx";
import { useSearch } from '../context/SearchContext';
import { useEffect } from "react";
import Navbar from "../components/Navbar.tsx";

const FavouritesPage = () => {
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
                <Favourites />
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

export default FavouritesPage;