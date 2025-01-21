const express = require('express');
const mongoose = require('mongoose');
const { User, Content, Rating } = require('./models');

const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error code
            return res.status(400).send({ error: 'Email already exists' });
        }
        console.error(err.message);
        res.status(400).send(err.message);
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).send(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send(err.message);
    }
});

// Add new content
router.post('/content', async (req, res) => {
    try {
        const content = new Content(req.body);
        await content.save();
        res.status(201).send(content);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get all content
router.get('/content', async (req, res) => {
    try {
        const content = await Content.find();
        console.log('Fetched Content:', content); // Debugging line
        res.status(200).send(content);
    } catch (err) {
        console.error('Error fetching content:', err);
        res.status(500).send(err.message);
    }
});


// Submit a rating for content
router.post('/rate', async (req, res) => {
    try {
        const { userId, contentId, rating } = req.body;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contentId)) {
            return res.status(400).send('Invalid userId or contentId');
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).send('Rating must be between 1 and 5');
        }

        // Save rating to database
        const newRating = new Rating({ userId, contentId, rating });
        await newRating.save();
        res.status(201).send({ message: 'Rating saved successfully', rating: newRating });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});


// Generate recommendations for a user
router.get('/recommendations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid userId');
        }

        // Get user's ratings
        const userRatings = await Rating.find({ userId }).populate('contentId');
        if (userRatings.length === 0) {
            return res.status(404).send('No ratings found for this user');
        }

        // Extract highly-rated content's attributes
        const highlyRatedSubjects = userRatings
            .filter(rating => rating.rating >= 4)
            .map(rating => rating.contentId.subject);

        // Find similar content based on subjects
        const recommendations = await Content.find({ subject: { $in: highlyRatedSubjects } });

        res.status(200).send(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// Get content by ID
router.get('/content/:id', async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) {
            return res.status(404).send('Content not found');
        }
        res.status(200).send(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});


module.exports = router;
