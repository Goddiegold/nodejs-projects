const express = require('express');

const {
    httpGetLaunches,
    httpSubmitLaunch,
    httpAbortLaunch
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/launches', httpGetLaunches)

module.exports = launchesRouter