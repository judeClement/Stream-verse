const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded Token:", decoded); 

      // ✅ Fetch full user details and store them in req.user
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ error: 'User not found in database' });
      }

      req.user = user; // ✅ Store the complete user object, not just decoded token
      // console.log("Authenticated User:", req.user);

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    console.log("No token found in request headers");
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};


// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  //console.log("Checking Admin Access for:", req.user); 

  if (!req.user || !req.user.email) {
    console.log("🔴 Access Denied: No email found in req.user");
    return res.status(403).json({ message: 'Access denied, admin only' });
  }

  console.log("🟢 Checking Admin Access for:", req.user.email); // ✅ Debug Log

  if (req.user.email === 'admin@gmail.com') {
    next();
  } else {
    console.log("🔴 Access Denied for:", req.user.email);
    res.status(403).json({ message: 'Access denied, admin only' });
  }
};

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch the full user details from the database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;  // Set the full user object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect, authenticate, isAdmin };
