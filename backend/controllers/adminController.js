const User = require('../models/User');

// Fetch all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        // Ensure only admin can access
        if (req.user.email !== 'admin@gmail.com') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Fetch users excluding passwords
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        if (req.user.email !== 'admin@gmail.com') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllUsers, deleteUser };
