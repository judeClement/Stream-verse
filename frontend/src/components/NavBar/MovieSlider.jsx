import React, { useState } from 'react';
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const MovieSlider = ({ movies }) => {
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [modal, setModal] = useState({ open: false, message: "", type: "success" });

    const API_KEY = 'fed8bdfdab036c276017de82f5ae9589';

    const fetchTrailer = async (movieId) => {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
            );
            const trailers = response.data.results.filter(
                (video) => video.type === 'Trailer' && video.site === 'YouTube'
            );

            if (trailers.length > 0) {
                setTrailerUrl(`https://www.youtube.com/embed/${trailers[0].key}`);
            } else {
                setModal({ open: true, message: "Trailer not available", type: "error" });
            }
        } catch (error) {
            console.error('Error fetching trailer:', error);
            setModal({ open: true, message: "Unable to fetch trailer", type: "error" });
        }
    };

    return (
        <div className="bg-white flex space-x-2 overflow-x-scroll scrollbar-hide p-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {movies.length > 0 ? (
                movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="min-w-[250px] shadow-sm bg-white border border-gray-50 text-white p-2 rounded hover:shadow-lg transition relative group"
                    >
                        {/* Image Section */}
                        <div className="relative group">
                            <img
                                src={
                                    movie.poster_path
                                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                        : 'https://via.placeholder.com/200x300?text=No+Image'
                                }
                                alt={movie.title}
                                className="w-full h-[300px] object-cover rounded transform transition-transform duration-300 group-hover:scale-105 group-hover:opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <button
                                    className="bg-green-700 text-white px-4 py-2 hover:bg-green-900 rounded shadow-lg"
                                    onClick={() => fetchTrailer(movie.id)}
                                >
                                    Watch Trailer
                                </button>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="mt-2 relative text-black">
                            <h4 className="text-sm font-semibold">{movie.title}</h4>
                            <p className="text-xs mt-1">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-white">No movies available</p>
            )}

            {/* Trailer Modal */}
            {trailerUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="relative w-[80%] h-[60%]">
                        <iframe
                            width="100%"
                            height="100%"
                            src={trailerUrl}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        ></iframe>
                        <button
                            onClick={() => setTrailerUrl(null)}
                            className="absolute -top-8 -right-8 bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold"
                        >
                            ✖
                        </button>
                    </div>
                </div>
            )}

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

export default MovieSlider;
