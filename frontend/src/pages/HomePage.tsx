import SearchResults from "../components/SearchResults";
import MovieCarousel from "../components/MovieCarousel.tsx";
import Navbar from "../components/Navbar.tsx";
import { useAppSelector } from "../app/hooks.ts";

const HomePage = () => {

    const searchState = useAppSelector((state) => state.search.searchState);

    return (
        <div>
            <Navbar isSearchBar={true}/>
            {!searchState && (
                <MovieCarousel />
            )}
            {searchState && (
                <SearchResults />
            )}
        </div>
    );
};

export default HomePage;
