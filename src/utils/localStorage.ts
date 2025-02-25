
export interface MovieItem{
    imdbID: string;
    addedToList: string; // ISO date string
    ratingState: "none" | "dislike" | "like" | "love";
    Type: "All" | "Movies" | "Series" | "Games";
}

const STORAGE_KEYS = {
    MOVIE_LIST: "movieList"
}

export const addToList = (imdbID: string, ratingState: "none" | "dislike" | "like" | "love", Type: "All" | "Movies" | "Series" | "Games") => {
    const movieList = getMovieList();

    const newMovie: MovieItem = {
        imdbID: imdbID,
        addedToList: new Date().toISOString(),
        ratingState: ratingState,
        Type: Type
    }

    movieList.unshift(newMovie);
    localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(movieList));
}

export const removeFromList = (imdbID: string) => {
    const movieList = getMovieList();

    const movieToRemove = movieList.find((movie) => movie.imdbID === imdbID);
    if(movieToRemove){
        const updatedList = movieList.filter((movie) => movie.imdbID !== imdbID);
        localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
    }    
}

export const updateRating = (imdbID: string, newRatingState: "none" | "dislike" | "like" | "love") => {
    const movieList = getMovieList();

    const updatedList = movieList.map((movie) =>
        movie.imdbID === imdbID ? { ...movie, ratingState: newRatingState} : movie
    );
    
    localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
}

export const getMovieList = (): MovieItem[] => {
  const list = localStorage.getItem(STORAGE_KEYS.MOVIE_LIST);
  return list ? JSON.parse(list) : [];
};