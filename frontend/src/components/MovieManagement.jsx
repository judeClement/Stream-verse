import React, { useEffect, useState } from 'react';
import api from '../api';

const MovieManagement = () => {
    const [movies, setMovies] = useState([]);
    const [newMovie, setNewMovie] = useState({ tmdbId: '', videoUrl: '', thumbnail: '' });

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
                tmdbId: Number(newMovie.tmdbId),  // Convert to number
            };

            await api.post('/admin/movies', movieData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Movie added successfully!');
            fetchMovies();  // Refresh movie list
        } catch (error) {
            console.error('Error adding movie:', error);
            alert(error.response?.data.message || 'Error adding movie');
        }
    };

    const handleDeleteMovie = async (movieId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await api.delete(`/admin/movies/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Movie deleted successfully!');
            fetchMovies();
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-black mb-4">Movie Management</h2>

            {/* Add New Movie */}
            <div className="bg-gray-800 p-4 rounded mb-6">
                <h3 className="text-white mb-4">Add New Movie</h3>
                <input
                    type="text"
                    placeholder="TMDB ID"
                    value={newMovie.tmdbId}
                    onChange={(e) => setNewMovie({ ...newMovie, tmdbId: e.target.value })}
                    className="block w-full p-2 mb-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Video URL"
                    value={newMovie.videoUrl}
                    onChange={(e) => setNewMovie({ ...newMovie, videoUrl: e.target.value })}
                    className="block w-full p-2 mb-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Thumbnail URL (Optional)"
                    value={newMovie.thumbnail}
                    onChange={(e) => setNewMovie({ ...newMovie, thumbnail: e.target.value })}
                    className="block w-full p-2 mb-4 rounded"
                />
                <button
                    onClick={handleAddMovie}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add Movie
                </button>
            </div>

            {/* Movie List */}
            <table className="w-full border border-gray-700 text-black">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="p-2">TMDB ID</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">Created At</th>
                        <th className="p-2">Thumbnail</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie._id} className="border-b border-gray-700 text-black">
                            <td className="p-2 text-center">{movie.tmdbId}</td>
                            <td className="p-2 text-center">{movie.title}</td>
                            <td className="p-2 text-center">{new Date(movie.createdAt).toLocaleDateString()}</td>
                            <td className="p-2 text-center">
                                {movie.thumbnail ? (
                                    <img src={movie.thumbnail} alt="Thumbnail" className="w-16 h-16 object-cover mx-auto" />
                                ) : 'N/A'}
                            </td>
                            <td className="p-2 text-center">
                                <button
                                    onClick={() => handleDeleteMovie(movie._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MovieManagement;
