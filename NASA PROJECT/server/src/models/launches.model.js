const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'kepler-442 b',
    customers: ['BINNA', 'NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch);

function existedLaunchesWithId(launchId) {
    return launches.has(launchId);
}

function getLaunch() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumber++

    launches.set(latestFlightNumber, Object.assign(launch,
        {
            flightNumber: latestFlightNumber,
            customers: ['BINNA', 'NASA'],
            upcoming: true,
            success: true,
        }
    ));
}

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;

    return aborted;
}

module.exports = {
    existedLaunchesWithId,
    getLaunch,
    addNewLaunch,
    abortLaunchById
};