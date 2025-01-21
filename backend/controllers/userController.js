const User = require('../models/User');

// Get Profile Data
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Decoded from JWT
    const user = await User.findById(userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProfile };
