const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, isAdmin ,authenticate } = require('../middleware/authMiddleware');
const { addMovie, deleteMovie } = require('../controllers/adminController');

const ActivityLog = require('../models/ActivityLog');

const router = express.Router();

// Fetch all users (Admin only)
router.get('/users', protect, authenticate, isAdmin, getAllUsers);

// Delete a user (Admin only)
router.delete('/users/:id', protect,authenticate, isAdmin, deleteUser);

// Fetch all user activity logs (Admin Only)
router.get('/logs', protect, isAdmin, async (req, res) => {
    try {
        const logs = await ActivityLog.find().populate('user', 'name email').sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs', error });
    }
});

// Add Movie (Admin Only)
router.post('/movies', protect, isAdmin, addMovie);

// Delete Movie (Admin Only)
router.delete('/movies/:id', protect, isAdmin, deleteMovie);

module.exports = router;
