import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon
import api from '../api'; // Axios instance for API calls

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
            <Container
                component="main"
                maxWidth="sm"
                style={{ marginTop: '100px', color: 'white' }}
            >
                <Paper
                    elevation={3}
                    style={{ padding: '20px', backgroundColor: '#1c1c1c' }}
                >
                    <Typography variant="h5" align="center" gutterBottom>
                        My Account
                    </Typography>
                    <form onSubmit={handleUpdate}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{
                                style: { backgroundColor: '#2c2c2c', color: 'white' },
                            }}
                            InputLabelProps={{
                                style: { color: '#00b300' },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                style: { backgroundColor: '#2c2c2c', color: 'white' },
                            }}
                            InputLabelProps={{
                                style: { color: '#00b300' },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Current Password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            InputProps={{
                                style: { backgroundColor: '#2c2c2c', color: 'white' },
                            }}
                            InputLabelProps={{
                                style: { color: '#00b300' },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="New Password (Optional)"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            InputProps={{
                                style: { backgroundColor: '#2c2c2c', color: 'white' },
                            }}
                            InputLabelProps={{
                                style: { color: '#00b300' },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{
                                backgroundColor: '#00b300',
                                color: 'white',
                                marginTop: '20px',
                            }}
                        >
                            Update Profile
                        </Button>
                        {message && (
                            <Typography
                                variant="body2"
                                align="center"
                                style={{
                                    marginTop: '10px',
                                    color: message.includes('Error') ? 'red' : '#00b300',
                                }}
                            >
                                {message}
                            </Typography>
                        )}
                    </form>
                    <Button
                        fullWidth
                        variant="outlined"
                        style={{ marginTop: '20px', color: '#00b300', borderColor: '#00b300' }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Paper>
            </Container>
            <h3 className="text-xl font-semibold mt-6">My Watchlist</h3>
            <div className="flex space-x-4 overflow-x-scroll scrollbar-hide mt-4"style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {watchLater.map((movie) => (
                    <div
                        key={movie.movieId}
                        className="relative min-w-[200px] bg-gray-800 p-2 rounded hover:shadow-lg transition cursor-pointer"
                    >
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-[300px] object-cover rounded"
                        />
                        <p className="mt-2 text-sm font-semibold">{movie.title}</p>
                        <DeleteIcon
                            onClick={() => handleRemove(movie.movieId)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default Profile;
