const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes'); // Import the routes file

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

mongoose.connection.once('open', () => {
    console.log(`Connected to database: ${mongoose.connection.name}`);
});


// Basic route
app.get('/', (req, res) => {
    res.send("API is running...");
});

// Use routes
app.use('/api', routes); // Register the routes under /api

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
