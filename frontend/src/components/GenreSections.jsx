import React from "react";
import api from "../api";  // Ensure API access for Watch Later functionality

const GenreSections = ({ movies, onMovieSelect }) => {
    // Group movies by genre
    const moviesByGenre = movies.reduce((acc, movie) => {
        if (movie.genres && movie.genres.length > 0) {
            movie.genres.forEach((genre) => {
                if (!acc[genre]) {
                    acc[genre] = [];
                }
                acc[genre].push(movie);
            });
        } else {
            // Fallback for movies without genres
            if (!acc["Uncategorized"]) {
                acc["Uncategorized"] = [];
            }
            acc["Uncategorized"].push(movie);
        }
        return acc;
    }, {});

    // Handle "Watch Later" functionality
    const handleWatchLater = async (movie) => {
        try {
            const token = localStorage.getItem('token');
            await api.post(
                '/watchLater/add',
                { movieId: movie.tmdbId.toString(), title: movie.title, poster: movie.thumbnail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`${movie.title} added to Watch Later!`);
        } catch (error) {
            alert(error.response?.data.message || 'Error adding to Watch Later');
        }
    };

    return (
        <div className="p-4">
            {Object.keys(moviesByGenre).map((genre) => (
                <div key={genre} className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{genre}</h2>
                    <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
                        {moviesByGenre[genre].map((movie) => (
                            <div
                                key={movie._id}
                                className="relative min-w-[200px] bg-gray-800 p-2 rounded hover:shadow-lg transition cursor-pointer"
                                onClick={() => onMovieSelect(movie)}  // Play movie on click
                            >
                                <img
                                    src={movie.poster || movie.thumbnail}
                                    alt={movie.title}
                                    className="w-full h-[300px] object-cover rounded"
                                />
                                <h4 className="mt-2 text-sm font-semibold">{movie.title || 'Untitled'}</h4>

                                {/* Watch Later Button */}
                                <button
                                    className="absolute top-2 right-2 text-white hover:text-green-500"
                                    onClick={(e) => { e.stopPropagation(); handleWatchLater(movie); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9l-5 5h10l-5-5zm0 0l5-5H9l5 5z" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GenreSections;
