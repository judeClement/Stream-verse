const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, isAdmin ,authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch all users (Admin only)
router.get('/users', protect, authenticate, isAdmin, getAllUsers);

// Delete a user (Admin only)
router.delete('/users/:id', protect,authenticate, isAdmin, deleteUser);

module.exports = router;
