

import SearchResults from "../components/SearchResults";
import Favourites from "../components/Favourites.tsx";
import Navbar from "../components/Navbar.tsx";
import { useAppSelector } from "../app/hooks.ts";

const FavouritesPage = () => {
    const searchState = useAppSelector((state) => state.search.searchState);

    return (
        <div>
            <Navbar isSearchBar={true}/>
            {!searchState && (
                <Favourites />
            )}
            {searchState && (
                <SearchResults />
            )}
        </div>
    );
};

export default FavouritesPage;