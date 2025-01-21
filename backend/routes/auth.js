const express = require('express');
const { registerUser, loginUser, getUser, updateUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Route for user signup
router.post('/signup', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route to get user details (requires authentication)
router.get('/me', authenticate, getUser);

// Route to update user details (requires authentication)
router.put('/update', authenticate, updateUser);

module.exports = router;
