const {
    existedLaunchesWithId,
    getLaunch,
    addNewLaunch,
    abortLaunchById
} = require('../../models/launches.model');

function httpGetLaunches(req, res) {
    res.status(200).json(getLaunch());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target)
    {
        return res.status(400)
        .json({error: 'Missing required fields'});
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate))
    {
        return res.status(400)
        .json({error: 'Invaid Launch Date'});
    }

    addNewLaunch(launch);

    return res.status(201).json(launch);
}


function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    
    if (!existedLaunchesWithId(launchId)) {
        return res.status(404).json({
            error: 'Launch not found'
        });
    } else {
        const aborted = abortLaunchById(launchId);
        return res.status(200).json(aborted);
    } 
}

module.exports = {
    httpGetLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}