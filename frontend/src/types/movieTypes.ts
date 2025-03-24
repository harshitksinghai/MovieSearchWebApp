export interface MovieDbItem {
  imdbID: string;
  addToWatchedList: string | null;
  addToWatchLater: string | null;
  ratingState: string;
  Type: string;
}
export interface MovieApiItem {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  totalSeasons?: string;
}

export interface MovieDetailsItem extends MovieApiItem, MovieDbItem {}

export interface SearchResultItem {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface SearchApiItem extends SearchResultItem, Omit<MovieDbItem, "imdbID" | "Type"> {}
