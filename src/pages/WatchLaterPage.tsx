
import Navbar from "../components/Navbar"
import SearchResults from "../components/SearchResults";
import WatchLater from "../components/WatchLater.tsx";
import { useSearch } from '../context/SearchContext';
import { useEffect } from "react";

const WatchLaterPage = () => {
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
                <WatchLater />
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

export default WatchLaterPage;