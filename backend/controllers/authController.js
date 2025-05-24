const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog')
const bcrypt = require('bcryptjs');

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

    // New hashing logic
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
      password: hashedPassword // Store hashed password
        });
        await newUser.save();

                // Log the activity
                await ActivityLog.create({
                    user: newUser._id,
                    action: 'SIGNUP',
                    // ip: req.ip,
                    userAgent: req.headers['user-agent']
                });

        // Generate JWT token after successful registration
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Return token along with success message
        res.status(201).json({ message: 'User registered successfully', token });
    
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
        if (!user) {
            return res.status(400).json({ error: 'Invalid email' });
        }

    // Replace direct comparison with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        // Log the activity
        await ActivityLog.create({
            user: user._id,
            action: 'LOGIN',
            userAgent: req.headers['user-agent']
        });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

    // Verify current password with bcrypt
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

        user.name = name || user.name;
        user.email = email || user.email;
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
          }

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

module.exports = { registerUser, loginUser, getUser, updateUser };


