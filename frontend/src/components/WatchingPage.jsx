import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar.jsx";
import RecommendedMovies from "./RecommendedMovies.jsx";

const WatchingPage = () => {
    const [currentMovie, setCurrentMovie] = useState(null);
    const [movieDetails, setMovieDetails] = useState(null);

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
            <div className="bg-black text-white min-h-screen">
                {/* Video Player */}
                <div className="relative w-full h-[90vh] bg-black mt-18 flex items-center justify-center">
                    {currentMovie ? (
                        <video
                            ref={videoRef}
                            src={currentMovie.videoUrl}
                            poster={currentMovie.thumbnail}
                            controls={isPlaying}
                            className="w-full h-full object-cover"
                            onError={() => console.error("Video failed to load or play.")}
                        ></video>
                    ) : (
                        <p className="text-center text-xl">Loading Movie...</p>
                    )}

                    {/* Custom Play/Pause Button */}
                    {!isPlaying && currentMovie && (
                        <button
                            onClick={togglePlayPause}
                            className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white rounded-full p-4 px-6 hover:bg-green-700 hover:scale-105 transition-transform"
                        >
                            ▶
                        </button>
                    )}
                </div>

                {/* Movie Details Section */}
                {movieDetails && (
                    <div className="p-4 bg-white text-black">
                        <h2 className="text-3xl font-bold mb-4">{movieDetails.title}</h2>
                        <p className="mb-2"><strong>Release Date:</strong> {movieDetails.release_date}</p>
                        <p className="mb-2"><strong>Runtime:</strong> {movieDetails.runtime} minutes</p>
                        <p className="mb-4"><strong>Overview:</strong> {movieDetails.overview}</p>
                        {movieDetails.genres && (
                            <p className="mb-4">
                                <strong>Genres:</strong> {movieDetails.genres.map((genre) => genre.name).join(", ")}
                            </p>
                        )}
                        {movieDetails.vote_average && (
                            <p className="mb-4"><strong>Rating:</strong> {movieDetails.vote_average} / 10</p>
                        )}
                    </div>
                )}

                {/* Recommended Movies Section */}
                <RecommendedMovies
                    onMovieSelect={handleMovieSelect}
                    onFirstMovieLoad={handleFirstMovieLoad}  // Automatically load the first movie
                />
            </div>
        </div>
    );
};

export default WatchingPage;
