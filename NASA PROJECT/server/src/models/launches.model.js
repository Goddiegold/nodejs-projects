const launches = new Map();

const launch = {
    flightNUmber: 100,
    mission: 'kepler Exploration X',
    rocket: 'Explorer IS1',
    launchData: new Date('December 27, 2030'),
    destination: 'kepler-442 b',
    customer: ['BINNA', 'NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNUmber, launch);

function getLaunch() {
    return Array.from(launches.values())
}

module.exports = {
    getLaunch
};