import React, { useEffect, useState } from "react";
import { MdBookmarkAdd } from "react-icons/md";
import api from '../api';
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";  

const RecommendedMovies = ({ onMovieSelect, onFirstMovieLoad }) => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modal, setModal] = useState({ open: false, message: "", type: "success" });

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

    const handleWatchLater = async (movie) => {
        try {
            const token = localStorage.getItem('token');
            await api.post(
                '/watchLater/add',
                { movieId: movie.tmdbId.toString(), title: movie.title, poster: movie.poster },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setModal({ open: true, message: `${movie.title} added to Watch Later!`, type: "success" });
        } catch (error) {
            setModal({ open: true, message: error.response?.data.message || 'Error adding to Watch Later', type: "error" });
        }
    };

    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 pb-10 border-b-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h2 className="text-3xl font-bold mb-3 sm:mb-6 text-black mt-6 border-b-4 border-green-600 inline-block pb-1">
                    Recommended Movies
                </h2>

                {/* Search Bar */}
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

            {/* Alert Modal */}
            {modal.open && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg p-6 sm:p-8 md:p-10 shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center relative transition-all transform scale-105 mx-4">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition" onClick={() => setModal({ open: false, message: "", type: "success" })}>
                            <IoClose size={24} />
                        </button>

                        <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full ${modal.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                            {modal.type === "success" ? <FaCheckCircle className="text-white text-3xl" /> : <FaExclamationCircle className="text-white text-3xl" />}
                        </div>

                        <p className="text-gray-800 text-xl mt-6">{modal.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecommendedMovies;
