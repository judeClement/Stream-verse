import React, { useEffect, useState } from 'react';
import api from '../api';
import { IoClose } from "react-icons/io5";

const MovieManagement = () => {
    const [movies, setMovies] = useState([]);
    const [newMovie, setNewMovie] = useState({ tmdbId: '', videoUrl: '', thumbnail: '' });
    const [modal, setModal] = useState({ open: false, message: "", type: "success" });
    const [confirmModal, setConfirmModal] = useState({ open: false, movieId: null });

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await api.get('/movies', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMovies(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleAddMovie = async () => {
        try {
            const token = localStorage.getItem('token');
            const movieData = {
                ...newMovie,
                tmdbId: Number(newMovie.tmdbId),
            };

            await api.post('/admin/movies', movieData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setModal({ open: true, message: "Movie added successfully!", type: "success" });
            fetchMovies();  
        } catch (error) {
            setModal({ open: true, message: error.response?.data.message || 'Error adding movie', type: "error" });
        }
    };

    const handleDeleteMovie = async () => {
        if (!confirmModal.movieId) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/admin/movies/${confirmModal.movieId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setModal({ open: true, message: "Movie deleted successfully!", type: "success" });
            fetchMovies();
        } catch (error) {
            setModal({ open: true, message: "Error deleting movie", type: "error" });
        } finally {
            setConfirmModal({ open: false, movieId: null });
        }
    };

    return (
        <div className="container mx-auto p-4 w-full max-w-7xl">
            <h2 className="text-2xl font-bold text-green-700 text-black mb-4 text-center md:text-left">Movie Management</h2>

            {/* Add New Movie */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
                <h3 className="text-green-700 text-xl font-semibold mb-4">Add New Movie</h3>
                
                <input type="text" placeholder="TMDB ID" value={newMovie.tmdbId} onChange={(e) => setNewMovie({ ...newMovie, tmdbId: e.target.value })} className="block w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input type="text" placeholder="Video URL" value={newMovie.videoUrl} onChange={(e) => setNewMovie({ ...newMovie, videoUrl: e.target.value })} className="block w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input type="text" placeholder="Thumbnail URL (Optional)" value={newMovie.thumbnail} onChange={(e) => setNewMovie({ ...newMovie, thumbnail: e.target.value })} className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                
                <button onClick={handleAddMovie} className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition w-full md:w-auto">
                    Add Movie
                </button>
            </div>

            {/* Movie List */}
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-black text-sm md:text-base shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-green-600 text-white">
                            <th className="p-3">TMDB ID</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Created At</th>
                            <th className="p-3">Thumbnail</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie, index) => (
                            <tr key={movie._id} className={`border-b border-gray-200 text-black ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-green-50 transition`}>
                                <td className="p-3 text-center break-words max-w-xs">{movie.tmdbId}</td>
                                <td className="p-3 text-center break-words max-w-xs font-semibold">{movie.title}</td>
                                <td className="p-3 text-center break-words max-w-xs">{new Date(movie.createdAt).toLocaleDateString()}</td>
                                <td className="p-3 text-center">{movie.thumbnail ? <img src={movie.thumbnail} alt="Thumbnail" className="w-16 h-16 object-cover mx-auto rounded-lg shadow-md" /> : 'N/A'}</td>
                                <td className="p-3 text-center">
                                    <button onClick={() => setConfirmModal({ open: true, movieId: movie._id })} className="bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Alert Modal */}
            {modal.open && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg p-6 sm:p-8 md:p-10 shadow-lg max-w-md w-full text-center relative transition-all transform scale-105 mx-4 sm:mx-8 md:mx-12">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition" onClick={() => setModal({ open: false, message: "", type: "success" })}>
                            <IoClose size={24} />
                        </button>
                        <p className="text-gray-800 text-xl mt-6">{modal.message}</p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmModal.open && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg p-6 sm:p-8 md:p-10 shadow-lg max-w-md w-full text-center relative transition-all transform scale-105 mx-4 sm:mx-8 md:mx-12">
                        <p className="text-gray-800 text-xl mb-4">Are you sure you want to delete this movie?</p>
                        <button onClick={handleDeleteMovie} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mr-2">Yes</button>
                        <button onClick={() => setConfirmModal({ open: false, movieId: null })} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieManagement;
