import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import { TextField, Button, Typography, Container, Paper, Link } from '@mui/material';
import api from '../api'; // Ensure this points to your Axios instance with the correct base URL

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Hook for navigation

    const validateForm = () => {
        let tempErrors = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!name.trim()) tempErrors.name = "Name is required";
        if (!email.trim()) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors.email = "Invalid email format";
        }
        if (!password) {
            tempErrors.password = "Password is required";
        } else if (!passwordRegex.test(password)) {
            tempErrors.password = "Password must be at least 8 characters long, include an uppercase letter, a number & special character";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await api.post('/auth/signup', { name, email, password });

            // Store Token After Signup
            localStorage.setItem('token', response.data.token);

            // Notify Navbar About Login Change
            window.dispatchEvent(new Event('storage'));

            setMessage('User registered successfully! Redirecting...');
            setErrors({});

            setTimeout(() => navigate('/'), 1000); // Redirect to homepage after 1 sec

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
                        error={!!errors.name}
                        helperText={errors.name}
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
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
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
                        error={!!errors.password}
                        helperText={errors.password}
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
                <Typography variant="body2" align="center" style={{ marginTop: "20px" }}>
                    Already a member?{" "}
                    <Link href="/login" style={{ color: "#00b300", textDecoration: "none", fontWeight: "bold" }}>
                        Login
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Signup;
