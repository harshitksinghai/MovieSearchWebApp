import SearchResults from "@/services/search-service/components/SearchResults";
import Navbar from "@/components/Navbar.tsx";
import { useAppSelector } from "@/app/reduxHooks.ts";
import HomeMovieList from "../components/HomeMovieList.tsx";

const HomePage = () => {
    console.log("Inside HomePage.tsx")

    const searchState = useAppSelector((state) => state.search.searchState);

    return (
        <div>
            <Navbar isSearchBar={true}/>
            {!searchState && (
                <HomeMovieList />
            )}
            {searchState && (
                <SearchResults />
            )}
        </div>
    );
};

export default HomePage;
