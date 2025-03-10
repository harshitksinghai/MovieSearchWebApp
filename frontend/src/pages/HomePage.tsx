

import SearchResults from "../components/SearchResults";
import MovieCarousel from "../components/MovieCarousel.tsx";
import { useEffect } from "react";
import Navbar from "../components/Navbar.tsx";

import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import { fetchMyListState } from "../features/movie/movieSlice.ts";

const HomePage = () => {

    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.auth.userId);
    const searchState = useAppSelector((state) => state.search.searchState);

    useEffect(() => {
        if(userId){
            dispatch(fetchMyListState(userId));  
            console.log("dispatched fetchMyListState asyncThunk")  
        }
    }, []);
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
