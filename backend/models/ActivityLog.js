const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., "LOGIN", "SIGNUP"
    timestamp: { type: Date, default: Date.now },
    // ip: { type: String }, // Store user's IP address
    userAgent: { type: String } // Store user's device/browser info
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
