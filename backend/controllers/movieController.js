const Movie = require("../models/movieModel");

// @desc    Add a new movie
// @route   POST /api/movies
// @access  Admin only
const addMovie = async (req, res) => {
    try {
        const { tmdbId, videoUrl } = req.body;
        if (!tmdbId || !videoUrl) {
            return res.status(400).json({ message: "TMDB Code and Video URL are required" });
        }

        const newMovie = await Movie.create({ tmdbId, videoUrl });
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ message: "Failed to add movie", error: error.message });
    }
};

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch movies", error: error.message });
    }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Admin only
const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        await movie.deleteOne();
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete movie", error: error.message });
    }
};

module.exports = { addMovie, getMovies, deleteMovie };
