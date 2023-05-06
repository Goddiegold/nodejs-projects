// Importing required models and utility functions
const {
    getAllLaunches,
    scheduleNewLaunch,
    existedLaunchesWithId,
    abortLaunchById
} = require('../../models/launches/launches.model');

const { getPagination } = require('../../utils/query');

// Function to retrieve all launches with pagination
async function httpGetLaunches(req, res) {
    try {
        const { skip, limit } = getPagination(req.query);
        const launches = await getAllLaunches(skip, limit)
        return res.status(200).json(launches);
    } catch (error) {
        console.error(error.message)
    }
}

// Function to add a new launch
async function httpAddNewLaunch(req, res) {
    try {
        const launch = req.body

        // Check if required fields are present in the request
        if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
            return res.status(400).json({ error: 'Missing required launch property' });
        }

        // Convert launch date to date object and check for valid date
        launch.launchDate = new Date(launch.launchDate);
        if (isNaN(launch.launchDate)) return res.status(400).json({ error: 'Invaid Launch Date' });

        // Schedule the new launch
        await scheduleNewLaunch(launch)
        return res.status(201).json(launch)
    } catch (error) {
        console.error(error.message)
    }
}

// Function to abort a launch by id
async function httpAbortLaunch(req, res) {
    try {
        const launchId = Number(req.params.id);
        const existlaunch = await existedLaunchesWithId(launchId);
    
        // Check if launch with given id exists
        if (!existlaunch) return res.status(404).json({ error: 'Launch not found' });

        // Abort the launch
        const aborted = await abortLaunchById(launchId);
        if (!aborted) return res.status(400).json({ error: 'Launch not aborted' });

        return res.status(200).json({ ok: true });
        
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = {
    httpGetLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}