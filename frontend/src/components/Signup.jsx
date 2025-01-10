import React, { useState } from 'react';
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
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Signup</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default Signup;
