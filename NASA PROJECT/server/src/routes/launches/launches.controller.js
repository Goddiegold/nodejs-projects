const {
    existedLaunchesWithId,
    getLaunch,
    scheduleNewLaunch,
    abortLaunchById
} = require('../../models/launches.model');

async function httpGetLaunches(req, res) {
    try {
        return res.status(200).json(await getLaunch());
    } catch (e) {
        console.error(e.message)
    }
}

async function httpAddNewLaunch(req, res) {
    try {
        const launch = req.body

        if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
            return res.status(400)
                .json({ error: 'Missing required fields' });
        }

        launch.launchDate = new Date(launch.launchDate);
        if (isNaN(launch.launchDate)) {
            return res.status(400)
                .json({ error: 'Invaid Launch Date' });
        }

        await scheduleNewLaunch(launch)

        return res.status(201).json(launch)
    } catch (e) {
        console.error(e.message)
    }
}


async function httpAbortLaunch(req, res) {
    try {
        const launchId = Number(req.params.id);
        const existlaunch = await existedLaunchesWithId(launchId);
    
        if (!existlaunch) {
            return res.status(404).json({
                error: 'Launch not found'
            });
        } else {
            const aborted = await abortLaunchById(launchId);
            if (!aborted) {
                return res.status(400).json({ error: 'Launch not aborted' });
            }
            return res.status(200).json({ ok: 'Launch aborted' });
        }
    } catch (e) {
        console.error(e.message)
    } 
}

module.exports = {
    httpGetLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}