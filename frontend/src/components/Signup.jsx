import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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
            setTimeout(() => navigate('/watch'), 1000);
        } catch (error) {
            setMessage(error.response?.data.message || 'Error occurred');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20"
        style={{ backgroundImage: "url('https://wallpaperaccess.com/full/3988284.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-white bg-opacity-90"></div>
            <div className="relative z-10 flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="w-full md:w-1/2 p-10">
                    <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Sign Up</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">Signup</button>
                        {message && (<p className="text-center text-green-600 mt-4">{message}</p>)}
                    </form>
                    <p className="text-center mt-6 text-gray-600">Already a member? <a href="/login" className="text-green-600 font-bold hover:underline">Login</a></p>
                </div>
                <div className="w-full md:w-1/2 bg-gradient-to-r from-green-500 to-green-700 flex flex-col justify-center items-center text-white p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
                    <p className="mb-6">We're happy to have you here. It's great to see you again. We hope you had a safe and enjoyable time away.</p>
                    <a href="/login" className="px-6 py-3 border border-white rounded-full text-white hover:bg-white hover:text-green-600 transition duration-200">Already Member? Login</a>
                </div>
            </div>
        </div>
    );
};

export default Signup;