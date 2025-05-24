import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import logo from '../components/logo-removedbg1.png';
import api from '../api';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation(); // Get current route

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.getElementById('dropdown');
            const avatar = document.getElementById('user-avatar');

            if (dropdownOpen && dropdown && !dropdown.contains(event.target) && !avatar.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        setIsLoggedIn(false); // Update login status
        navigate('/login'); // Redirect to login page
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                isScrolled ? 'bg-black text-white shadow-md' : 'bg-transparent text-white'
            }`}
        >
            <div className="font-questrial flex justify-between items-center max-w-8xl mx-auto p-4 px-6">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="StreamVerse Logo" className="size-10 object-contain" />
                </Link>

                <nav>
                    <ul className="flex space-x-6 font-bold">
                        <li>
                            <Link to="/" className="font-medium transition-colors duration-300 hover:font-semibold" style={{ color: "#009150" }}>
                                Home
                            </Link>
                        </li>
                        {isLoggedIn ? (
                            <li>
                                <Link to="/watch" className="font-medium transition-colors duration-300 hover:font-semibold" style={{ color: "#009150" }}>
                                    Browse
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="font-medium transition-colors duration-300 hover:font-semibold" style={{ color: "#009150" }}>
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="font-medium transition-colors duration-300 hover:font-semibold" style={{ color: "#009150" }}>
                                        Signup
                                    </Link>
                                </li>
                            </>
                        )}
                        {user && user.email === 'admin@gmail.com' && (
                            <li>
                                <Link to="/admin/dashboard" className="font-medium transition-colors duration-300 hover:font-semibold" style={{ color: "#009150" }}>
                                    Dashboard
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                {/* Hide Avatar on Home Page */}
                {location.pathname !== '/' && (
                    <div className="relative">
                        <img
                            id="user-avatar"
                            src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"
                            alt="User Avatar"
                            className="h-10 w-10 rounded-full cursor-pointer border-2 border-green-900 hover:border-green-400 transition"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                        {dropdownOpen && (
                            <div id="dropdown" className="absolute right-0 mt-3 w-48 bg-white text-black rounded-lg shadow-xl backdrop-blur-lg transition-transform transform scale-95 origin-top-right animate-fadeIn">
                                <ul>
                                    {user && (
                                        <li className="px-4 rounded-lg py-3 flex items-center space-x-3">
                                            <img
                                                src={user.avatar || "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"}
                                                alt="User Avatar"
                                                className="h-8 w-8 rounded-full border-2 border-green-500"
                                            />
                                            <div>
                                                <p className="font-semibold">{user.name || "User"}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </li>
                                    )}
                                    <li className="px-4 rounded-lg py-3 hover:bg-gray-100 transition cursor-pointer flex items-center space-x-3">
                                        <Link to="/profile">My Account</Link>
                                    </li>
                                    <li className="px-4 rounded-lg py-3 hover:bg-gray-100 transition cursor-pointer flex items-center space-x-3">
                                        <button onClick={handleLogout}>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
