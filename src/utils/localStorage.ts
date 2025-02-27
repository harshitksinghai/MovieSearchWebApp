
export interface MovieItem{
    imdbID: string;
    addToWatchedList: string; // ISO date string
    addToWatchLaterList: string; // ISO date string
    ratingState: "none" | "dislike" | "like" | "love";
    Type: "All" | "Movies" | "Series" | "Games";
}

const STORAGE_KEYS = {
    MOVIE_LIST: "movieList",
}

export const addToList = (imdbID: string, ratingState: "none" | "dislike" | "like" | "love", Type: "All" | "Movies" | "Series" | "Games", isAddToWatchedList: boolean, isAddToWatchLaterList: boolean) => {
    const movieList = getMovieList();

    const newMovie: MovieItem = {
        imdbID: imdbID,
        addToWatchedList: (isAddToWatchedList) ? new Date().toISOString() : '',
        addToWatchLaterList: (isAddToWatchLaterList) ? new Date().toISOString() : '',
        ratingState: ratingState,
        Type: Type
    }

    movieList.unshift(newMovie);
    localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(movieList));
}

export const removeFromWatchedList = (imdbID: string) => {
    const movieList = getMovieList();

    const movieToRemove = movieList.find((movie) => movie.imdbID === imdbID);
    if(!movieToRemove){
        return;
    }
    if(movieToRemove && movieToRemove.addToWatchLaterList === ''){
        const updatedList = movieList.filter((movie) => movie.imdbID !== imdbID);
        localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
    }
    else{
        const updatedList = movieList.map((movie) => {
            if (movie.imdbID === imdbID) {
                return {
                    ...movie,
                    ratingState: 'none',
                    addToWatchedList: '',
                };
            }
            return movie;
        });
        localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
    }
}

export const removeFromWatchLaterList = (imdbID: string) => {
    const movieList = getMovieList();

    const movieToRemove = movieList.find((movie) => movie.imdbID === imdbID);
    if(!movieToRemove){
        return;
    }
    if(movieToRemove && movieToRemove.addToWatchedList === ''){
        const updatedList = movieList.filter((movie) => movie.imdbID !== imdbID);
        localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
    }
    else{
        const updatedList = movieList.map((movie) =>
            movie.imdbID === imdbID ? { ...movie, addToWatchLaterList: ''} : movie
        );
        localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
    }
}

export const updateRating = (imdbID: string, ratingState: "none" | "dislike" | "like" | "love", Type: "All" | "Movies" | "Series" | "Games") => {
    const movieList = getMovieList();
    const storedMovie = movieList.find((m) => m.imdbID === imdbID);

    if(!storedMovie){
        addToList(imdbID, ratingState, Type, true, false);
        return;
    }

    const updatedList = movieList.map((movie) => {
        if (movie.imdbID === imdbID) {
            return {
                ...movie,
                ratingState: ratingState,
                addToWatchedList: movie.addToWatchedList || new Date().toISOString(),
            };
        }
        return movie;
    });

    localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
}

export const addToWatchLaterList = (imdbID: string, ratingState: "none" | "dislike" | "like" | "love", Type: "All" | "Movies" | "Series" | "Games") => {
    const movieList = getMovieList();
    const storedMovie = movieList.find((m) => m.imdbID === imdbID);

    if(!storedMovie){
        addToList(imdbID, ratingState, Type, false, true);
        return;
    }

    const updatedList = movieList.map((movie) => {
        if (movie.imdbID === imdbID) {
            return {
                ...movie,
                addToWatchLaterList: movie.addToWatchLaterList || new Date().toISOString(),
            };
        }
        return movie;
    });

    localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
}

export const getMovieList = (): MovieItem[] => {
  const list = localStorage.getItem(STORAGE_KEYS.MOVIE_LIST);
  return list ? JSON.parse(list) : [];
};