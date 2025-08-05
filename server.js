// server.js

const express = require('express');
const cors = require('cors'); // Import CORS package
const { getQuestions } = require('./database.js');

const app = express();
const PORT = 3000; // The port our server will run on

// Use CORS middleware to allow requests from our front-end
// In a real production environment, you should configure this more securely.
app.use(cors()); 

// Define an API endpoint to get the quiz questions
app.get('/api/questions', (req, res) => {
    const questions = getQuestions();
    res.json(questions); // Send the questions as a JSON response
});

// Start the server
app.listen(PORT, () => {
    console.log(`Quiz server running at http://localhost:${PORT}`);
});
