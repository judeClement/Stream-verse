import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import api from '../api'; // Ensure this points to your Axios instance with the correct base URL

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', { name, email, password }); // Updated route
            setMessage('User registered successfully!');
        } catch (error) {
            setMessage(error.response?.data.message || 'Error occurred');
        }
    };

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: '100px' }}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#141414', color: 'white' }}>
                <Typography variant="h5" align="center" style={{ marginBottom: '20px' }}>
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputProps={{
                            style: { backgroundColor: '#1c1c1c', color: 'white' },
                        }}
                        InputLabelProps={{
                            style: { color: '#00b300' }, // Green color for label
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
                            style: { backgroundColor: '#1c1c1c', color: 'white' },
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
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            style: { backgroundColor: '#1c1c1c', color: 'white' },
                        }}
                        InputLabelProps={{
                            style: { color: '#00b300' },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: '#00b300', color: 'white', marginTop: '20px' }}
                    >
                        Signup
                    </Button>
                    {message && (
                      <Typography variant="body2" align="center" style={{ marginTop: '10px', color: '#00b300' }}>
                          {message}
                      </Typography>
                    )}
                </form>
            </Paper>
        </Container>
    );
};

export default Signup;
