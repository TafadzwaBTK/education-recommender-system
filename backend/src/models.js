const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    createdAt: { type: Date, default: Date.now },
});

// Content Schema
const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    createdAt: { type: Date, default: Date.now },
}, { collection: 'content' }); // Explicitly specify the collection name

// Rating Schema
const RatingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Export Models
const User = mongoose.model('User', UserSchema);
const Content = mongoose.model('Content', ContentSchema);
const Rating = mongoose.model('Rating', RatingSchema);

module.exports = { User, Content, Rating };
