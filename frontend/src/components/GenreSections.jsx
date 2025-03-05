import React, { useState } from "react";
import { MdBookmarkAdd } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import api from "../api";

const GenreSections = ({ movies, onMovieSelect }) => {
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [modal, setModal] = useState({ open: false, type: "success", message: "" });

    const moviesByGenre = movies.reduce((acc, movie) => {
        if (movie.genres && movie.genres.length > 0) {
            movie.genres.forEach((genre) => {
                if (!acc[genre]) acc[genre] = [];
                acc[genre].push(movie);
            });
        } else {
            if (!acc["Uncategorized"]) acc["Uncategorized"] = [];
            acc["Uncategorized"].push(movie);
        }
        return acc;
    }, {});

    const handleWatchLater = async (movie) => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/watchLater/add",
                { movieId: movie.tmdbId.toString(), title: movie.title, poster: movie.poster },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setModal({ open: true, type: "success", message: `${movie.title} Added to Watch Later.` });

            setTimeout(() => setModal({ open: false, message: "" }), 5000);
        } catch (error) {
            setModal({ open: true, type: "error", message: `${movie.title} Alraedy Added` });

            setTimeout(() => setModal({ open: false, message: "" }), 5000);
        }
    };

    return (
        <div className="p-4">
            {/* Title and Filter Container */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className="text-3xl font-bold text-black border-b-4 border-green-600 inline-block pb-1">
                    Movies by Genre
                </h2>
                <div className="mt-2 sm:mt-0">
                    <select 
                        className="p-2 border rounded-xl text-gray-500 w-full sm:w-auto"
                        value={selectedGenre} 
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="All">All</option>
                        {Object.keys(moviesByGenre).map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {Object.keys(moviesByGenre).map((genre) => (
                (selectedGenre === "All" || selectedGenre === genre) && (
                    <div key={genre} className="mb-1 pb-4 border-b-2">
                        <h2 className="text-2xl font-bold text-black inline-block pt-6">{genre}</h2>
                        <div className="flex space-x-4 pl-2 overflow-x-scroll scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                            {moviesByGenre[genre].map((movie) => (
                                <div
                                    key={movie._id}
                                    className="min-w-[250px] border rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-100 relative cursor-pointer my-6"
                                    onClick={() => onMovieSelect(movie)}
                                >
                                    <div className="relative transition-transform transform hover:scale-105 relative cursor-pointer">
                                        <img
                                            src={movie.poster || movie.thumbnail || "https://via.placeholder.com/200x300?text=No+Image"}
                                            alt={movie.title}
                                            loading="lazy"
                                            className="w-full h-[350px] object-cover rounded-t-lg transition-opacity duration-300 group-hover:opacity-80"
                                        />
                                    </div>
                                    <div className="p-3 text-black">
                                        <h4 className="text-lg font-semibold truncate">{movie.title || "Untitled"}</h4>
                                    </div>
                                    <button
                                        className="absolute top-2 right-2 text-white hover:text-green-500 transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleWatchLater(movie);
                                        }}
                                    >
                                        <MdBookmarkAdd size={28} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}

            {/* Styled Modal */}
            {modal.open && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg p-6 sm:p-8 md:p-10 py-10 shadow-lg max-w-md w-full text-center relative transition-all transform scale-105 mx-4 sm:mx-8 md:mx-12">
                        {/* Close Button */}
                        <button 
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
                            onClick={() => setModal({ open: false, message: "" })}
                        >
                            <IoClose size={24} />
                        </button>

                        {/* Icon */}
                        <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full ${modal.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                            {modal.type === "success" ? <FaCheckCircle className="text-white text-3xl" /> : <FaQuestionCircle className="text-white text-3xl" />}
                        </div>

                        {/* Message */}
                        <p className="text-gray-800 text-xl mt-6">{modal.message}</p>

                    </div>
                </div>
            )}
        </div>
    );
};

export default GenreSections;
