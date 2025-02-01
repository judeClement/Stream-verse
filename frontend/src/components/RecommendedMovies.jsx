import React, { useEffect, useState } from "react";
import api from '../api';

const RecommendedMovies = ({ onMovieSelect }) => {
    const [movies, setMovies] = useState([]);

    const predefinedMovies = [
        {
            id: 949423,
            videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail: "https://image.tmdb.org/t/p/original/8rmx3Wh6fQdSL2nzTmdFn9thcK8.jpg",
        },
        {
            id: 1034541,
            videoUrl: "http://103.145.232.246/Data/movies/Hollywood/2024/Terrifier%203%20%282024%29/Terrifier.3.2024.720p.WEBRip.x264.AAC-%5BYTS.MX%5D.mp4",
            thumbnail: "https://image.tmdb.org/t/p/original/2WmA3qTmgD3G11WvqjzQ6YoLzxZ.jpg",
        },
        {
            id: 863873,
            videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail: "https://image.tmdb.org/t/p/original/jcpUCn3oFKitAnbwosoPqaMFccj.jpg",
        },
    ];

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const apiKey = "fed8bdfdab036c276017de82f5ae9589";
                const moviePromises = predefinedMovies.map(async (movie) => {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US`
                    );
                    const data = await response.json();
                    return { ...movie, title: data.title, poster: `https://image.tmdb.org/t/p/w500/${data.poster_path}` };
                });

                const fetchedMovies = await Promise.all(moviePromises);
                setMovies(fetchedMovies);
            } catch (error) {
                console.error("Error fetching recommended movies:", error);
            }
        };

        fetchMovies();
    }, []);


    const handleWatchLater = async (movie) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post(
                '/watchLater/add',
                {
                    movieId: movie.id.toString(), // Ensure movieId is sent as a string
                    title: movie.title,
                    poster: movie.poster,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
                alert(`${movie.title} added to Watch Later!`); // Success message
        } catch (error) {
            const message = error.response?.data.message || 'Error adding to Watch Later';
            alert(message); // Show duplicate error or other messages
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
            <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="relative min-w-[200px] bg-gray-800 p-2 rounded hover:shadow-lg transition cursor-pointer"
                            onClick={() => onMovieSelect(movie)}
                        >
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-[300px] object-cover rounded"
                            />
                            <h4 className="mt-2 text-sm font-semibold">{movie.title}</h4>
                            {/* Watch Later Icon */}
                            <button
    className="absolute top-2 right-2 text-white hover:text-green-500"
    onClick={(e) => {
        e.stopPropagation(); // Prevent triggering onMovieSelect
        handleWatchLater(movie);
    }}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
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
