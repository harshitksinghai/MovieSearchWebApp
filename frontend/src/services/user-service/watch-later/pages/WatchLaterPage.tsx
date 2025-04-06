
import { useAppSelector } from "@/app/reduxHooks.ts";
import Navbar from "@/components/Navbar"
import SearchResults from "@/services/search-service/components/SearchResults";
import WatchLater from "../components/WatchLater.tsx";

const WatchLaterPage = () => {
    const searchState = useAppSelector((state) => state.search.searchState);

    return (
        <div>
            <Navbar isSearchBar={true}/>
            {!searchState && (
                <WatchLater />
            )}
            {searchState && (
                <SearchResults />
            )}
        </div>
    );
};

export default WatchLaterPage;