const User = require('../models/User');
const Movie = require('../models/Movie');
const axios = require('axios');

// Fetch all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        // Ensure only admin can access
        if (req.user.email !== 'admin@gmail.com') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Fetch users excluding passwords
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        if (req.user.email !== 'admin@gmail.com') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }


};

const addMovie = async (req, res) => {
    try {
        let { tmdbId, videoUrl, thumbnail } = req.body;

                // Convert tmdbId to Number if it's not already
                tmdbId = Number(tmdbId);
                if (isNaN(tmdbId)) {
                    return res.status(400).json({ message: 'Invalid TMDB ID. It must be a number.' });
                }
                console.log(`Adding movie with TMDB ID: ${tmdbId}, Video URL: ${videoUrl}, Thumbnail: ${thumbnail}`);

        // Check for duplicate movies
        const existingMovie = await Movie.findOne({ tmdbId });
        if (existingMovie) {
            return res.status(400).json({ message: 'Movie already exists' });
        }

        // Fetch movie details from TMDB
        const tmdbApiKey = process.env.TMDB_API_KEY || 'fed8bdfdab036c276017de82f5ae9589'; // Use your TMDB API key
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbApiKey}&language=en-US`);

        const movieTitle = tmdbResponse.data.title || 'Untitled'; // Fallback if title isn't found
        const posterPath = tmdbResponse.data.poster_path ? `https://image.tmdb.org/t/p/w500/${tmdbResponse.data.poster_path}` : null;
        console.log(`Fetched TMDB title: ${movieTitle}, Poster: ${posterPath}`);

        // Save to the database
        const newMovie = new Movie({
            tmdbId,
            title: movieTitle,
            videoUrl,
            thumbnail: thumbnail || posterPath  // Use provided thumbnail or TMDB poster
        });

        await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully', movie: newMovie });

    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ message: 'Error adding movie', error: error.message });
    }
};
    
    // Delete Movie (Admin only)
    const deleteMovie = async (req, res) => {
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Movie deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting movie', error: error.message });
        }
    };
    
    // Get All Movies (Public)
    const getAllMovies = async (req, res) => {
        try {
            const movies = await Movie.find();
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching movies', error: error.message });
        }
    };
    
module.exports = { getAllUsers, deleteUser, addMovie, deleteMovie, getAllMovies };
