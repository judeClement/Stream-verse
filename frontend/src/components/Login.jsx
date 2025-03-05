import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Ensure this points to your Axios instance

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", data.token);
            setMessage("Login successful!");
            navigate("/watch");
        } catch (error) {
            setMessage(error.response?.data.error || "Error occurred");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20"           
         style={{ backgroundImage: "url('https://wallpaperaccess.com/full/3988284.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            
            <div className="absolute inset-0 bg-white bg-opacity-90"></div>

            <div className="relative z-10 flex flex-col md:flex-row w-full max-w-4xl shadow-lg rounded-lg overflow-hidden bg-white">
                
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Signin</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                        >
                            Signin
                        </button>
                        {message && (
                            <p className="text-center text-green-600 mt-2">{message}</p>
                        )}
                    </form>

                    <p className="text-center text-gray-500 mt-6">or signin with</p>
                    
                    <div className="flex justify-center space-x-4 mt-4">
                        <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                            F
                        </button>
                        <button className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700">
                            G+
                        </button>
                        <button className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-900">
                            in
                        </button>
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-gradient-to-r from-green-500 to-green-700 text-white flex flex-col justify-center items-center p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
                    <p className="mb-6">
                        We're so happy to have you here. It's great to see you again!
                    </p>
                    <a
                        href="/signup"
                        className="px-6 py-3 border border-white rounded-full text-white hover:bg-white hover:text-green-600 transition duration-200"
                    >
                        No account yet? Signup.
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
