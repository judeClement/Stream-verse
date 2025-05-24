import React, { useState } from "react";
import { MdBookmarkAdd } from "react-icons/md";
import api from "../api";
import Swal from "sweetalert2";

const GenreSections = ({ movies, onMovieSelect }) => {
    const [selectedGenre, setSelectedGenre] = useState("All");

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

    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
            popup: "w-96 p-6 text-sm"
        },
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const handleWatchLater = async (movie) => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/watchLater/add",
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

    return (
        <div className="p-4">
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
        className="min-w-[250px] max-w-[250px] border rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-100 relative cursor-pointer my-6"
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
        <div className="p-3 text-black w-full">
            <h4 className="text-lg font-semibold truncate w-full">{movie.title || "Untitled"}</h4>
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
        </div>
    );
};

export default GenreSections;
