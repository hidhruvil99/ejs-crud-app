const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    userProfile: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
