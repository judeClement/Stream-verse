const express = require('express');
const { getAllMovies } = require('../controllers/adminController');

const router = express.Router();

// Public route to fetch all movies
router.get('/', getAllMovies);

module.exports = router; 
