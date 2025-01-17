import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../components/logo.jpg';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

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

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-black text-white shadow-md' // Change text color to white when scrolled
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
                                    isScrolled ? 'text-white' : 'text-green-700' // White text on scroll
                                }`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/login"
                                className={`hover:text-white ${
                                    isScrolled ? 'text-white' : 'text-green-700' // White text on scroll
                                }`}
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/signup"
                                className={`hover:text-white ${
                                    isScrolled ? 'text-white' : 'text-green-700' // White text on scroll
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
                        src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div
                            className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg transition-opacity duration-300 ease-in-out opacity-0 animate-fadeIn"
                        >
                            <ul>
                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                                    <Link to="/account">My Account</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                                    <button onClick={() => alert('Logout clicked')}>
                                        Logout
                                    </button>
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
