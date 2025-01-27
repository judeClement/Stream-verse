const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();
const User = require('../models/User');

// Add movie to Watch Later
router.post('/add', authenticate, async (req, res) => {
    try {
        const { movieId, title, poster } = req.body;
        const user = await User.findById(req.user.id);
        user.watchLater.push({ movieId, title, poster });
        await user.save();
        res.status(200).json({ message: 'Movie added to Watch Later!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding movie to Watch Later' });
    }
});

// Get Watch Later list
router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user.watchLater);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Watch Later list' });
    }
});

// Remove movie from Watch Later
router.delete('/:movieId', authenticate, async (req, res) => {
    try {
        const { movieId } = req.params; // Extract movieId from request params
        console.log('Received DELETE request for movieId:', movieId); // Log for debugging

        const user = await User.findById(req.user.id);

        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const initialLength = user.watchLater.length;

        // Convert both movieId to strings for comparison
        user.watchLater = user.watchLater.filter(movie => {
            console.log(`Checking movie: ${movie.movieId} against ${movieId}`);
            return movie.movieId !== movieId.toString();
        });

        if (user.watchLater.length === initialLength) {
            console.error('Movie not found in Watch Later list');
            return res.status(404).json({ message: 'Movie not found in Watch Later list' });
        }

        await user.save();
        console.log('Successfully removed movie from Watch Later list');
        res.status(200).json({ message: 'Movie removed from Watch Later!' });
    } catch (error) {
        console.error('Error removing movie from Watch Later:', error);
        res.status(500).json({ message: 'Error removing movie from Watch Later' });
    }
});


module.exports = router;
