import React, { useEffect, useState } from "react";
import api from '../api';

const RecommendedMovies = ({ onMovieSelect,onFirstMovieLoad }) => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get('/movies'); // Fetch from new API
                setMovies(response.data);
                                // Call the onFirstMovieLoad callback with the first movie
                                if (response.data.length > 0 && onFirstMovieLoad) {
                                    onFirstMovieLoad(response.data[0]);
                                }
            } catch (error) {
                console.error("Error fetching recommended movies:", error);
            }
        };
        fetchMovies();
    }, []);

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
            <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
            <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div
                            key={movie._id}
                            className="relative min-w-[200px] bg-gray-800 p-2 rounded hover:shadow-lg transition cursor-pointer"
                            onClick={() => onMovieSelect(movie)}
                        >
                            <img src={movie.thumbnail} alt={movie.title} className="w-full h-[300px] object-cover rounded" />
                            <h4 className="mt-2 text-sm font-semibold">{movie.title || 'Untitled'}</h4>
                            <button
                                className="absolute top-2 right-2 text-white hover:text-green-500"
                                onClick={(e) => { e.stopPropagation(); handleWatchLater(movie); }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9l-5 5h10l-5-5zm0 0l5-5H9l5 5z" />
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Loading recommended movies...</p>
                )}
            </div>
        </div>
    );
};

export default RecommendedMovies;
