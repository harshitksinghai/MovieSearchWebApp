import MovieDetails from "../components/MovieDetails"
import Navbar from "../components/Navbar"

const MovieDetailsPage = () => {
    return (
        <>
        <Navbar isSearchBar={false} />
        <MovieDetails />
        </>
    )
}

export default MovieDetailsPage;