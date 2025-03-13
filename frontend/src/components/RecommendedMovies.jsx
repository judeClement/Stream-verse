import React, { useEffect, useState } from "react";
import { MdBookmarkAdd } from "react-icons/md";
import api from '../api';
import Swal from "sweetalert2";

const RecommendedMovies = ({ onMovieSelect, onFirstMovieLoad }) => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get('/movies');
                setMovies(response.data);
                if (response.data.length > 0 && onFirstMovieLoad) {
                    onFirstMovieLoad(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching recommended movies:", error);
            }
        };
        fetchMovies();
    }, []);

    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: { 
            popup: 'w-96 p-6 text-sm' 
        },
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const handleWatchLater = async (movie) => {
        try {
            const token = localStorage.getItem('token');
            await api.post(
                '/watchLater/add',
                { movieId: movie.tmdbId.toString(), title: movie.title, poster: movie.poster },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            Toast.fire({
                icon: "success",
                title: `${movie.title} added to Watch Later!`
            });
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: error.response?.data.message || "Error adding to Watch Later"
            });
        }
    };

    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 px-4 pb-10 border-b-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h2 className="text-3xl font-bold mb-3 sm:mb-6 text-black mt-6 border-b-4 border-green-600 inline-block pb-1">
                    Recommended Movies
                </h2>

                <input 
                    type="text" 
                    placeholder="Search movies..." 
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 pl-4 border rounded-xl text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex space-x-4 pl-2 overflow-x-scroll scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <div
                            key={movie._id}
                            className="min-w-[250px] bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-100 relative cursor-pointer my-6"
                            onClick={() => onMovieSelect(movie)}
                        >
                            <div className="relative transition-transform transform hover:scale-105 relative cursor-pointer">
                                <img
                                    src={movie.poster || 'https://via.placeholder.com/200x300?text=No+Image'}
                                    alt={movie.title}
                                    loading="lazy"
                                    className="w-full h-[350px] object-cover rounded-t-lg transition-opacity duration-300 group-hover:opacity-80"
                                />
                            </div>
                            <div className="p-3 text-white">
                                <h4 className="text-lg font-semibold text-black truncate">{movie.title || 'Untitled'}</h4>
                            </div>
                            <button
                                className="absolute top-2 right-2 text-white hover:text-green-500 transition"
                                onClick={(e) => { e.stopPropagation(); handleWatchLater(movie); }}
                            >
                                <MdBookmarkAdd size={28} />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-white">No movies found...</p>
                )}
            </div>
        </div>
    );
};

export default RecommendedMovies;
