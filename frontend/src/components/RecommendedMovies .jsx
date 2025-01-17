import React, { useEffect, useState } from "react";

const RecommendedMovies = ({ onMovieSelect }) => {
    const [movies, setMovies] = useState([]);

    // Array of TMDb movie IDs for specific movies
    const movieIds = [
        811656, // Pearl (2022)
        1083874, // Caddo Lake
        1006621, // Float (2023)
        1003579, // Kraven the Hunter (2024)
        993076, // Lights Out (2024)
        1002921, // MaXXXine (2024)
        1003573, // Madame Web (2024)
        1221930, // Terrifier 3 (2024)
        1036787, // Stream (2024)
    ];

    // Fetch details for the specified movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const apiKey = "fed8bdfdab036c276017de82f5ae9589";
                const movieData = await Promise.all(
                    movieIds.map(async (id) => {
                        const response = await fetch(
                            `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
                        );
                        return await response.json();
                    })
                );
                setMovies(movieData);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
            <div
                className="flex space-x-4 overflow-x-scroll scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="min-w-[200px] bg-gray-800 p-2 rounded hover:shadow-lg transition cursor-pointer"
                            onClick={() => onMovieSelect(movie)}
                        >
                            <img
                                src={
                                    movie.poster_path
                                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                        : "https://via.placeholder.com/200x300?text=No+Image"
                                }
                                alt={movie.title}
                                className="w-full h-[300px] object-cover rounded"
                            />
                            <h4 className="mt-2 text-sm font-semibold">{movie.title}</h4>
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
