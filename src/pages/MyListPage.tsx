
import Navbar from "../components/Navbar";
import SearchResults from "../components/SearchResults";
import HomeList from "../components/HomeList";
import { useSearch } from '../context/SearchContext';
import { useEffect } from "react";

const MyListPage = () => {
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
        // Reset search state only if we're coming from a different page, not from a search
        // if (!window.location.search) {
            handleSearchState(false);
        // }
    }, []);

    return (
        <div>
            <Navbar />
            {!searchState && (
                <HomeList />
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

export default MyListPage;