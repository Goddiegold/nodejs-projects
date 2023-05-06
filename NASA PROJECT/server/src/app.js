// Import the necessary modules
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const api = require('./routes/api')

// Enable CORS for requests from http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Log incoming requests to the console
app.use(morgan('combined'));

// Parse incoming JSON requests
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Use the API routes and make the route use versioning
app.use('/v1', api);

// Serve the index.html file for any unmatched routes
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app;