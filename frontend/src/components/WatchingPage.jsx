import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar.jsx";
import RecommendedMovies from "./RecommendedMovies .jsx";

const WatchingPage = () => {
    // Default movie
    const defaultMovie = {
        id: 389, // TMDb ID for "12 Angry Men"
        videoUrl: "https://ia801207.us.archive.org/30/items/12-angry-men-1957_202312/12%20Angry%20Men%20%281957%29.mp4",
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
            videoUrl: `https://via.placeholder.com/800x450?text=Video+Unavailable`, // Placeholder, replace with real video source
            thumbnail: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
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

                {/* Feedback Section */}
                <div className="p-4">
                    <h2 className="text-2xl font-semibold mb-4">Add Feedback</h2>
                    <form className="bg-gray-800 p-4 rounded">
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full p-2 bg-gray-700 rounded text-white"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 bg-gray-700 rounded text-white"
                                placeholder="Your Email"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Comments</label>
                            <textarea
                                className="w-full p-2 bg-gray-700 rounded text-white"
                                rows="4"
                                placeholder="Your Feedback"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WatchingPage;
