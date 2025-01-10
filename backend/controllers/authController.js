const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Generated Hash:', hashedPassword); // Show the hashed password in terminal

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        console.log('User:', user); // Log user details
        console.log('Login Password:', password); // Logs raw input password
        console.log('Hashed Password:', user.password); // Logs hashed password from DB

        if (!user) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch); // Log password comparison result
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated Token:', token); // Log generated token

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err); // Log any errors
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { registerUser, loginUser };
