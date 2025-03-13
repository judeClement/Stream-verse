import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar.jsx";
import RecommendedMovies from "./RecommendedMovies.jsx";
import Footer from '../components/Footer';
import GenreSections from "./GenreSections.jsx";  // NEW IMPORT
import api from "../api";  // Ensure you have access to the API
import CircularProgress from '@mui/material/CircularProgress';

const WatchingPage = () => {
    const [currentMovie, setCurrentMovie] = useState(null);
    const [movieDetails, setMovieDetails] = useState(null);
    const [allMovies, setAllMovies] = useState([]);  // NEW STATE FOR ALL MOVIES
    const videoSectionRef = useRef(null);  // Ref for video player section

    // Fetch movies and their genres from TMDB
    useEffect(() => {
        const fetchAllMoviesWithGenres = async () => {
            try {
                const response = await api.get('/movies');
                const movies = response.data;

                // Fetch genres for each movie from TMDB
                const moviesWithGenres = await Promise.all(movies.map(async (movie) => {
                    if (movie.tmdbId) {
                        try {
                            const apiKey = "fed8bdfdab036c276017de82f5ae9589";
                            const tmdbResponse = await fetch(
                                `https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=${apiKey}&language=en-US`
                            );
                            const tmdbData = await tmdbResponse.json();
                            
                            // Merge genres into the movie object
                            return {
                                ...movie,
                                genres: tmdbData.genres ? tmdbData.genres.map(genre => genre.name) : [],
                                poster: movie.poster || `https://image.tmdb.org/t/p/original${tmdbData.poster_path}`
                            };
                        } catch (error) {
                            console.error(`Error fetching TMDB data for movie ${movie.title}:`, error);
                            return { ...movie, genres: [] };  // Fallback if TMDB fetch fails
                        }
                    }
                    return { ...movie, genres: [] };  // If no tmdbId
                }));

                setAllMovies(moviesWithGenres);
            } catch (error) {
                console.error("Error fetching all movies:", error);
            }
        };

        fetchAllMoviesWithGenres();
    }, []);

    // Fetch movie details from TMDB
    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!currentMovie || !currentMovie.tmdbId) return;  // Ensure currentMovie is set before fetching

            try {
                const apiKey = "fed8bdfdab036c276017de82f5ae9589";
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${currentMovie.tmdbId}?api_key=${apiKey}&language=en-US`
                );
                const data = await response.json();
                setMovieDetails(data);

                // Set thumbnail if not provided
                if (!currentMovie.thumbnail && data.poster_path) {
                    setCurrentMovie((prevMovie) => ({
                        ...prevMovie,
                        thumbnail: `https://image.tmdb.org/t/p/original${data.poster_path}`,
                    }));
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [currentMovie]);

    // Video player controls
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const togglePlayPause = () => {
        const video = videoRef.current;

        // Ensure video source is valid before playing
        if (!video || !video.src || video.networkState === 3) {
            console.error("No valid video source available.");
            return;
        }

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Handle movie selection from RecommendedMovies
    const handleMovieSelect = (movie) => {
        setCurrentMovie(movie);
        setIsPlaying(false);
                // Scroll to the video player smoothly
                if (videoSectionRef.current) {
                    videoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                }
    };

    // Automatically load the first recommended movie
    const handleFirstMovieLoad = (firstMovie) => {
        if (!currentMovie) {
            setCurrentMovie(firstMovie);
        }
    };

    
    return (
        <div>
            <Navbar />
            <div className="bg-black text-white min-h-screen bg-white">
                
            <div
    ref={videoSectionRef}
    className="relative w-full h-[100vh] bg-black mt-18 flex items-center justify-center overflow-hidden"
>
    {currentMovie ? (
        <video
            ref={videoRef}
            src={currentMovie.videoUrl}
            poster={currentMovie.thumbnail || currentMovie.poster}
            controls={isPlaying}
            className="w-full h-full object-cover"
            onError={() => console.error("Video failed to load or play.")}
        ></video>
    ) : (
<div className="flex flex-col items-center space-y-4">
    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
</div>

    )}

{/* Gradient Overlay for Better Text Contrast */}
{!isPlaying && (
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70"></div>
)}


{/* Custom Play/Pause Button */}
{!isPlaying && currentMovie && (
    <button
        onClick={togglePlayPause}
        className="absolute z-9 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-green-600 text-white rounded-full p-6 shadow-lg hover:bg-green-700 
                   hover:scale-110 transition-transform duration-300 ease-in-out"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-4 h-4"
        >
            <path d="M8 5v14l11-7z" />
        </svg>
    </button>
)}

    {/* Bottom Shadow for Video Player */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    

{/* Movie Title Display */}
{!isPlaying && currentMovie && (
    <div className="absolute bottom-8 left-8 z-9">
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold mb-2 text-white px-4 py-2 rounded-lg shadow-md">
            {currentMovie.title}
        </h2>
        <p className="text-lg text-gray-800 bg-green-400 bg-opacity-50 px-3 py-1 rounded-md shadow-sm">
            {currentMovie.description}
        </p>
    </div>
)}
           </div>


{/* Movie Details Section */}
{movieDetails && (
    <div className="flex justify-center px-6 md:px-12 py-16 bg-gray-100">
        <div className="p-8 md:p-12 bg-white text-black rounded-2xl shadow-2xl max-w-4xl w-full border-b-2 border-green-400">
            
            {/* Release Date and Runtime */}
            <div className="flex flex-col md:flex-row md:justify-between text-xl text-gray-800 mb-6">
                <p className="mb-4 md:mb-0 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v5h5v-2h-3V8z" />
                        <path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm0 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
                    </svg>
                    <strong className="text-green-700">Release Date:</strong> {movieDetails.release_date}
                </p>
                <p className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 2v2H7V2H5v2H3v2h18V4h-2V2zM5 20h14V8H5v12zM7 10h10v10H7V10z" />
                    </svg>
                    <strong className="text-green-700">Runtime:</strong> {movieDetails.runtime} minutes
                </p>
            </div>

            {/* Overview */}
            <p className="text-gray-800 mb-6 leading-relaxed text-lg">
                <strong className="text-green-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 0 0-9.5 13.09l-1.45 4.36a1 1 0 0 0 1.24 1.25l4.36-1.45A10 10 0 1 0 12 2zm-4 11H7v-2h1zm8 0h-1v-2h1zm-4 0h-2v-2h2z" />
                    </svg>
                    Overview:
                </strong> 
                {movieDetails.overview}
            </p>

            {/* Genres */}
            {movieDetails.genres && (
                <div className="mb-6">
                    <strong className="text-green-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 3v18h20V3H2zm18 16H4V5h16v14zM8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
                        </svg>
                        Genres:
                    </strong>
                    <div className="mt-3 flex flex-wrap gap-3">
                        {movieDetails.genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="bg-green-100 text-green-900 px-4 py-2 rounded-full text-base font-medium"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating */}
            {movieDetails.vote_average && (
                <div className="mt-6">
                    <strong className="text-green-900 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
                        </svg>
                        Rating:
                    </strong>
                    <div className="flex items-center mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
                            <div
                                className="bg-green-700 h-4 rounded-full"
                                style={{ width: `${(movieDetails.vote_average / 10) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-lg font-bold text-gray-800 whitespace-nowrap">{movieDetails.vote_average} / 10</span>
                    </div>
                </div>
            )}
        </div>
    </div>
)}


{/* Recommended Movies Section */}
<div className="px-6 md:px-12 py-10">
    <RecommendedMovies
        onMovieSelect={handleMovieSelect}
        onFirstMovieLoad={handleFirstMovieLoad}  // Automatically load the first movie
    />
</div>


{/* New Genre Sections */}
<div className="px-6 md:px-12 py-4">
    {allMovies.length > 0 && (
        <GenreSections movies={allMovies} onMovieSelect={handleMovieSelect} />
    )}
</div>

            </div>
            <Footer/>
        </div>
    );
};

export default WatchingPage;
