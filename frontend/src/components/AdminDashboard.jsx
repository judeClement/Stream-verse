import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [movies, setMovies] = useState([]);
    const [newMovie, setNewMovie] = useState({ tmdbId: '', videoUrl: '', thumbnail: '' });
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetched Users:", users);  // This will log the updated users after deletion
    }, [users]);
    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token
                if (!token) {
                    console.error("No token found");
                    return;
                }
    
                const { data } = await api.get('/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }, // Include token
                });
    
                setUsers(data);
                console.log(data);

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        fetchUsers();
    }, []);
    

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await api.delete(`/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Remove deleted user from UI without refreshing the page
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await api.get('/admin/logs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };
        fetchLogs();
    }, []);

        // Fetch movies from backend
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
    
        useEffect(() => {
            fetchMovies();  // Call the function when component mounts
        }, []);
    
        // Add a new movie
        const handleAddMovie = async () => {
            try {
                const token = localStorage.getItem('token');
                const movieData = {
                    ...newMovie,
                    tmdbId: Number(newMovie.tmdbId),  // Convert to Number before sending
                };
        
                await api.post('/admin/movies', movieData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                alert('Movie added successfully!');
                fetchMovies();  // Refresh the movie list after adding
            } catch (error) {
                console.error('Error adding movie:', error);
                alert(error.response?.data.message || 'Error adding movie');
            }
        };
        
    
        // Delete a movie
        const handleDeletemovie = async (movieId) => {
            const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
            if (!confirmDelete) return;
    
            try {
                const token = localStorage.getItem('token');
                await api.delete(`/admin/movies/${movieId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Movie deleted successfully!');
                fetchMovies();  // Refresh the movie list after deletion
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        };
    
    return (
        <div>
        <Navbar/>
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <table className="w-full mt-5 border border-gray-700 text-white">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-700 text-black">
                            <td className="p-2 text-center">{user.name}</td>
                            <td className="p-2 text-center">{user.email}</td>
                            <td className="p-2 text-center">
                                <button
                                    onClick={() => handleDelete(user._id)}
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
        <div className="container mx-auto mt-10 p-4">
    <h2 className="text-xl font-bold text-white mb-4">User Activity Logs</h2>
    <table className="w-full border border-gray-700 text-white">
        <thead>
            <tr className="bg-gray-800">
                <th className="p-2 text-center">User</th>
                <th className="p-2 text-center">Mail Id</th>
                <th className="p-2 text-center">Action</th>
                <th className="p-2 text-center">Timestamp</th>
                {/* <th className="p-2 text-center">IP Address</th> */}
                {/* <th className="p-2 text-center">Device</th> */}
            </tr>
        </thead>
        <tbody>
            {logs.map((log) => (
                <tr key={log._id} className="border-b border-gray-700 text-black">
                    <td className="p-2 text-center">{log.user.name}</td>
                    <td className="p-2 text-center">{log.user.email}</td>
                    <td className="p-2 text-center">{log.action}</td>
                    <td className="p-2 text-center">{new Date(log.timestamp).toLocaleString()}</td>
                    {/* <td className="p-2 text-center">{log.ip || 'N/A'}</td> */}
                    {/* <td className="p-2 text-center">{log.userAgent || 'N/A'}</td> */}
                </tr>
            ))}
        </tbody>
    </table>
</div>

        {/* Add New Movie Form */}
        <div className="bg-gray-800 p-4 rounded mb-6">
                    <h2 className="text-xl text-white mb-4">Add New Movie</h2>
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

                {/* Movies List */}
                <h2 className="text-xl font-bold text-white mb-4">Movies List</h2>
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
                                <td className="p-2 text-center">{movie.createdAt}</td>
                                <td className="p-2 text-center">
                                    {movie.thumbnail ? <img src={movie.thumbnail} alt="Thumbnail" className="w-16 h-16 object-cover mx-auto" /> : 'N/A'}
                                </td>
                                <td className="p-2 text-center">
                                    <button
                                        onClick={() => handleDeletemovie(movie._id)}
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

export default AdminDashboard;
