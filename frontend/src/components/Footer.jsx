// File: src/components/Footer.jsx

import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
<div className="bg-black text-gray-300">
    <footer className="flex justify-center">
        <div className="max-w-7xl w-full px-6 py-16">
            {/* Top Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
                {/* Brand Info */}
                <div>
                    <h2 className="text-2xl font-bold text-white">StreamNow</h2>
                    <p className="text-sm text-gray-400 mt-2">
                        Your ultimate destination for unlimited streaming entertainment.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col space-y-3">
                    <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                    <a href="/" className="hover:text-white transition">About Us</a>
                    <a href="/" className="hover:text-white transition">Contact</a>
                    <a href="/" className="hover:text-white transition">FAQ</a>
                    <a href="/" className="hover:text-white transition">Careers</a>
                </div>

                {/* Legal */}
                <div className="flex flex-col space-y-3">
                    <h3 className="text-lg font-semibold text-white">Legal</h3>
                    <a href="/" className="hover:text-white transition">Privacy Policy</a>
                    <a href="/" className="hover:text-white transition">Terms of Service</a>
                    <a href="/" className="hover:text-white transition">Cookie Policy</a>
                </div>
            </div>

            {/* Social Media & Copyright */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
                {/* Social Icons */}
                <div className="flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        <FaFacebookF size={20} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        <FaTwitter size={20} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        <FaInstagram size={20} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        <FaYoutube size={20} />
                    </a>
                </div>

                {/* Copyright */}
                <p className="text-sm text-gray-500 mt-6 sm:mt-0">
                    © {new Date().getFullYear()} Jude Clement. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
</div>

  );
};

export default Footer;
