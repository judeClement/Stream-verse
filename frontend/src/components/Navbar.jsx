import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../components/logo.jpg';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        navigate('/login'); // Redirect to login page
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-black text-white shadow-md'
                    : 'bg-transparent text-white'
            }`}
        >
            <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="StreamVerse Logo"
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                {/* Navigation Links */}
                <nav>
                    <ul className="flex space-x-6">
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
                    </ul>
                </nav>

                {/* User Avatar */}
                <div className="relative">
                    <img
                        id="user-avatar"
                        src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div
                            id="dropdown"
                            className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg transition-opacity duration-300 ease-in-out opacity-100"
                        >
                            <ul>
                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                                    <Link to="/profile">My Account</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
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
