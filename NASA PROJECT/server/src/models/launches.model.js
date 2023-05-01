const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

async function existedLaunchesWithId(launchId) {
    return await launchesDatabase.findOne({ flightNumber: launchId });
}

async function getLaunch() {
    try {
        return await launchesDatabase.find({}, { '_id': 0, '__v': 0 })
    } catch (e) {
        console.error(e.message)
    }
}

async function saveLaunch(launch) {
    try {
        const planet = await planets.findOne({ keplerName: launch.target });

        if (!planet) {
            throw new Error('No matching planet found');   
        }

        await launchesDatabase.findOneAndUpdate(
            { flightNumber: launch.flightNumber },
            launch,
            { upsert: true }
        )
    } catch (e) {
        console.error(e.message)
    }
}

async function getlatestFlightNumber() {
    try {
        const latestLaunch = await launchesDatabase
            .findOne()
            .sort('-flightNumber');
        
        if (!latestLaunch) {
            return DEFAULT_FLIGHT_NUMBER;
        }

        return latestLaunch.flightNumber 
    } catch (e) {
        console.error(e.message)
    }
}

async function scheduleNewLaunch(launch) {
    try {
        let newFlightNumber = await getlatestFlightNumber() + 1;

        const newLaunch = Object.assign(launch,
            {
                flightNumber: newFlightNumber,
                customers: ['OBINNA', 'NASA'],
                upcoming: true,
                success: true,
            }
        )

        await saveLaunch(newLaunch)
    } catch (e) {
        console.error(e.message)
    }
}

async function abortLaunchById(launchId) {
    try {
        const aborted = await launchesDatabase.updateOne(
            { flightNumber: launchId },
            { upcoming: false, success: false }
        )
        return aborted.modifiedCount === 1;
    } catch (e) {
        console.error(e.message)
    }   
}

module.exports = {
    existedLaunchesWithId,
    getLaunch,
    scheduleNewLaunch,
    abortLaunchById
};