const express = require('express');

// Import the controller functions for handling HTTP request
const { httpGetAllPlanets
} = require('./planets.controller');

// Create a new router object
const planetsRouter = express.Router();

// Defining a route for the GET request to '/planets' endpoint and
// associating mapped to the corresponding controller function
planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;