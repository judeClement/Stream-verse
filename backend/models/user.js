const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchLater: [
        {
            movieId: { type: String, unique: true }, // Ensure movieId is unique in the array
            title: String,
            poster: String,
        },
    ],
});

module.exports = mongoose.model('User', UserSchema);
