const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const watchLaterRoutes = require('./routes/watchLaterRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import Admin Routes

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies

app.use('/api/users', userRoutes);

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/watchLater', watchLaterRoutes);

app.use('/api/admin', adminRoutes); // Add Admin Routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
