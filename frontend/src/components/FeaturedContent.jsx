import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeaturedContent = () => {
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const API_KEY = 'fed8bdfdab036c276017de82f5ae9589';

    useEffect(() => {
        const fetchFeaturedMovies = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
                );
                setFeaturedMovies(response.data.results.slice(0, 5)); // Limit to 5 featured movies
            } catch (error) {
                console.error('Error fetching featured movies:', error);
            }
        };

        fetchFeaturedMovies();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                featuredMovies.length > 0 ? (prevIndex + 1) % featuredMovies.length : 0
            );
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [featuredMovies]);

    if (featuredMovies.length === 0) {
        return <p className="text-center text-white">Loading featured content...</p>;
    }

    const currentMovie = featuredMovies[currentIndex];

    return (
        <section className="relative bg-black text-white h-screen">
            {/* Slide Image */}
            <img
                src={
                    currentMovie.backdrop_path
                        ? `https://image.tmdb.org/t/p/original/${currentMovie.backdrop_path}`
                        : 'https://via.placeholder.com/1200x400?text=No+Image'
                }
                alt="Featured Background"
                className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Shadow Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                {/* Fixed Text */}
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    Watch Unlimited Movies
                </h2>

                {/* Input Box and Watch Button */}
                <div className="flex items-center gap-2 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Enter movie or keyword"
                        className="flex-1 px-4 py-2 rounded-l-md text-black focus:outline-none"
                    />
                    <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-r-md text-white">
                        Watch
                    </button>
                </div>
                <p className="text-sm md:text-ms m-2">Sign in to see more</p>
            </div>
        </section>
    );
};

export default FeaturedContent;
