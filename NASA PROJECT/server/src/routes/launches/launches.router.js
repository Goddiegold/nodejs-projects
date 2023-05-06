const express = require('express');

// Import the controller functions for handling HTTP requests
const {
    httpGetLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
} = require('./launches.controller');

// Create a new router object
const launchesRouter = express.Router();

// Set up the HTTP routes for GET, POST, and DELETE requests
// The HTTP routes are mapped to the corresponding controller functions
launchesRouter.get('/', httpGetLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter