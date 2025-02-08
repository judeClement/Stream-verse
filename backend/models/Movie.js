const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    tmdbId: { type: Number, required: true, unique: true },  // Ensure this matches the frontend field
    title: { type: String },  // Add title to store the fetched TMDB title
    videoUrl: { type: String, required: true },
    thumbnail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
