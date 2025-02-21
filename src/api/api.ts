import axios from "axios";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const API_URL = import.meta.env.VITE_OMDB_API_URL;

const POPULAR_MOVIES = [
    "Avatar", "Inception", "Interstellar", "The Dark Knight",
    "Spider-Man", "Iron Man", "Black Panther", "Wonder Woman"
];

const POPULAR_SERIES = [
    "Breaking Bad", "Game of Thrones", "Stranger Things", "The Crown",
    "The Mandalorian", "Friends", "The Office", "Better Call Saul"
];

export const fetchMovies = async (query?: string, year?: string, type?: string, page: number = 1) => {
    console.log('Fetching with params:', { query, year, type, page });

    if (query) {
        try {
            let url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
            if (year) url += `&y=${encodeURIComponent(year)}`;
            if (type) url += `&type=${encodeURIComponent(type)}`;

            console.log('Request URL:', url);
            const response = await axios.get(url);
            console.log('API Response:', response);

            if (response.data.Response === "True") {
                return {
                    movies: response.data.Search,
                    totalPages: Math.ceil(Number(response.data.totalResults) / 10),
                    error: null
                };
            }
            
            return { 
                movies: [], 
                totalPages: 1, 
                error: response.data.Error || "No results found" 
            };
        } catch (error: any) {
            console.error('API Error:', error);
            return { 
                movies: [], 
                totalPages: 1, 
                error: error.message || "Failed to fetch movies" 
            };
        }
    }
    
    else {
        try {
            const titles = type === "series" ? POPULAR_SERIES : POPULAR_MOVIES;
            
            const promises = titles.map(title => 
                axios.get(`${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}${type ? `&type=${type}` : ''}`)
            );
            
            const results = await Promise.all(promises);
            console.log('API Promises Results:', results)

            const validResults = results
                .map(response => response.data)
                .filter(data => data.Response === "True");
            
            console.log('API Promises Valid Results:', results)
            

            return {
                movies: validResults,
                totalPages: 1,
                error: null
            };
        } catch (error: any) {
            console.error('API Error:', error);
            return {
                movies: [],
                totalPages: 1,
                error: error.message || "Failed to fetch movies"
            };
        }
    }
};