import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon
import api from '../api'; // Axios instance for API calls
import { MdOutlineBookmarkRemove } from "react-icons/md";  // Imported the delete icon

const Profile = () => {
    const [user, setUser] = useState({ name: '', email: '' });
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchUserData(token);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const { data } = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(data);
            setName(data.name);
            setEmail(data.email);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await api.put(
                '/auth/update',
                { name, email, currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(data.message);
            fetchUserData(token); // Refresh user data
        } catch (error) {
            setMessage(error.response?.data.message || 'Error updating profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const [watchLater, setWatchLater] = useState([]);

    useEffect(() => {
        const fetchWatchLater = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await api.get('/watchLater', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWatchLater(data);
            } catch (error) {
                console.error('Error fetching Watch Later list:', error);
            }
        };

        fetchWatchLater();
    }, []);

    const handleRemove = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/watchLater/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWatchLater((prev) => prev.filter((movie) => movie.movieId !== movieId));
        } catch (error) {
            console.error('Error removing movie from Watch Later list:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex mt-20 justify-center items-center p-6 bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-8">
                <h1 className="text-2xl font-bold text-center text-green-700 mb-8">My Account</h1>
                
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-green-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-green-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-green-700 font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-green-700 font-medium mb-1">New Password (Optional)</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-300"
                    >
                        Update Profile
                    </button>

                    {message && (
                        <p className={`text-center mt-4 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-700'}`}>
                            {message}
                        </p>
                    )}
                </form>

                <button
                    onClick={handleLogout}
                    className="w-full mt-6 border border-green-700 text-green-700 py-2 rounded-md hover:bg-green-700 hover:text-white transition duration-300"
                >
                    Logout
                </button>
            </div>
            </div>
            <div className="p-4">
            <h3 className="text-3xl font-semibold mt-6 text-gray-700 border-b-4 border-green-600 inline-block pb-1">My Watchlist</h3>
            <div className="flex space-x-4 pl-2 overflow-x-scroll scrollbar-hide mt-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {watchLater.map((movie) => (
                    <div
                        key={movie.movieId}
                        className="group min-w-[250px] bg-white border rounded-lg shadow-md transition-transform transform hover:scale-100 relative cursor-pointer my-6"
                    >
                        <div className="relative">
                            <img
                                src={movie.poster || 'https://via.placeholder.com/200x300?text=No+Image'}
                                alt={movie.title}
                                loading="lazy"
                                className="w-full h-[350px] object-cover rounded-t-lg"
                            />
                        </div>
                        <div className="p-3 text-black">
                            <p className="text-lg font-semibold truncate group-hover:text-red-500">
                                {movie.title || 'Untitled'}
                            </p>
                        </div>
                        <button
                            className="absolute top-2 right-2 text-white group-hover:text-red-500 transition"
                            onClick={() => handleRemove(movie.movieId)}
                        >
                            <MdOutlineBookmarkRemove size={28} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default Profile;
