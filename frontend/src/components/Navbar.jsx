import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../components/logo-removedbg1.png';
import logo1 from '../components/logo1.png';
import logo2 from '../components/logo2.png';

import api from '../api';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.getElementById('dropdown');
            const avatar = document.getElementById('user-avatar');

            if (dropdownOpen && dropdown && !dropdown.contains(event.target) && !avatar.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };
    
        checkLoginStatus(); // Initial check
        window.addEventListener('storage', checkLoginStatus); // Detect token changes
    
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);
    

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-black text-white shadow-md'
                    : 'bg-transparent text-white'
            }`}
        >
            <div className="font-questrial flex justify-between items-center max-w-8xl mx-auto p-4 px-6">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="StreamVerse Logo"
                        className="size-10 object-contain"
                    />
                </Link>

               {/* Navigation Links */}
                <nav>
                    <ul className="flex space-x-6 font-bold">
                        <li>
                            <Link
                                to="/"
                                className={`hover:text-white ${
                                    isScrolled ? 'text-white' : 'text-green-700'
                                }`}
                            >
                                Home
                            </Link>
                        </li>
                        {isLoggedIn ? (
                            // Show Browse if user is logged in
                            <li>
                                <Link
                                    to="/watch"
                                    className={`hover:text-white ${
                                        isScrolled ? 'text-white' : 'text-green-700'
                                    }`}
                                >
                                    Browse
                                </Link>
                            </li>
                        ) : (
                            <>
                                {/* Show Login and Signup if user is not logged in */}
                                <li>
                                    <Link
                                        to="/login"
                                        className={`hover:text-white ${
                                            isScrolled ? 'text-white' : 'text-green-700'
                                        }`}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signup"
                                        className={`hover:text-white ${
                                            isScrolled ? 'text-white' : 'text-green-700'
                                        }`}
                                    >
                                        Signup
                                    </Link>
                                </li>
                            </>
                        )}
                         {user && user.email === 'admin@gmail.com' && (
                            <li>
                              <Link to="/admin/dashboard"  className={`hover:text-white ${
                                        isScrolled ? 'text-white' : 'text-green-700'
                                    }`}>
                                  Dashboard
                              </Link>
                            </li>
                          )}
                    </ul>
                </nav>

                {/* User Avatar */}
                <div className="relative">
                    <img
                        id="user-avatar"
                        src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full cursor-pointer border-2 border-green-900 hover:border-green-400 transition"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div
    id="dropdown"
    className="absolute right-0 mt-3 w-48 bg-black text-white rounded-lg shadow-xl backdrop-blur-lg transition-transform transform scale-95 origin-top-right animate-fadeIn"
>
    <ul className="divide-y divide-gray-700">
        {/* User Info Section */}
        {user && (
            <li className="px-4 py-3 flex items-center space-x-3">
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

        {/* My Account */}
        <li className="px-4 py-3 hover:bg-gray-800 transition cursor-pointer flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.486 2 2 6.486 2 12c0 5.514 4.486 10 10 10s10-4.486 10-10c0-5.514-4.486-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <Link to="/profile">My Account</Link>
        </li>

        {/* Logout */}
        <li className="px-4 py-3 hover:bg-gray-800 transition cursor-pointer flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.09 15.59L12.67 18l6.33-6.41-6.33-6.41-2.58 2.41L14 12l-3.91 3.59zM4 4h7V2H4C2.9 2 2 2.9 2 4v16c0 1.1.9 2 2 2h7v-2H4V4z"/>
            </svg>
            <button onClick={handleLogout}>Logout</button>
        </li>
    </ul>
</div>

                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
