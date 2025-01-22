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

module.exports = router;
