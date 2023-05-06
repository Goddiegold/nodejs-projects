const express = require('express');

// import routers for planets and launches
const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

// create an instance of Express Router
const api = express.Router();

// Mount planetsRouter on the /planets route
api.use('/planets', planetsRouter)

// Mount launchesRouter on the /launches route
api.use('/launches', launchesRouter);

module.exports = api;