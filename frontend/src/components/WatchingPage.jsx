import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar.jsx";
import RecommendedMovies from "./RecommendedMovies.jsx";

const WatchingPage = () => {
    // Default movie
    const defaultMovie = {
        id: 389, // TMDb ID for "12 Angry Men"
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", // Dummy video URL
        thumbnail: "https://facts.net/wp-content/uploads/2023/06/35-facts-about-the-movie-12-angry-men-1687250389.jpg",
    };

    const [currentMovie, setCurrentMovie] = useState(defaultMovie);
    const [movieDetails, setMovieDetails] = useState(null);

    // Fetch movie details
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const apiKey = "fed8bdfdab036c276017de82f5ae9589";
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${currentMovie.id}?api_key=${apiKey}&language=en-US`
                );
                const data = await response.json();
                setMovieDetails(data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        if (currentMovie.id) fetchMovieDetails();
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

    // Handle movie selection
    const handleMovieSelect = (movie) => {
        setCurrentMovie({
            id: movie.id,
            videoUrl: movie.videoUrl, // Set dummy video URL
            thumbnail: movie.thumbnail, // Set movie-specific thumbnail
        });
        setIsPlaying(false);
    };

    return (
        <div>
            <Navbar />
            <div className="bg-black text-white min-h-screen">
                {/* Video Player */}
                <div className="relative w-full h-[90vh] bg-black mt-18 flex items-center justify-center">
                    <video
                        ref={videoRef}
                        src={currentMovie.videoUrl}
                        poster={currentMovie.thumbnail}
                        controls={isPlaying}
                        className="w-full h-full object-cover"
                        onError={() => console.error("Video failed to load or play.")}
                    ></video>

                    {/* Custom Play/Pause Button */}
                    {!isPlaying && (
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
                <RecommendedMovies onMovieSelect={handleMovieSelect} />
            </div>
        </div>
    );
};

export default WatchingPage;
