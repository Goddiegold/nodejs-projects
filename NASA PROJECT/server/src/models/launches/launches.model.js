// Import required module
const axios = require('axios')

// Import launchesDatabase and planets modules, which provides functions 
// to interact with the planets and lanuches collection in the database
const launchesDatabase = require('./launches.mongo');
const planets = require('../planets/planets.model');

// The SpaceX API endpoint for querying launches
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

// Query parameters for the SpaceX API
const QUERY_API = {
    query: {},
    options: {
        pagination: false,
        populate: [
            {
                path: 'rocket',
                select: { name: 1 }
            },
            {
                path: 'payloads',
                select: { customers: 1 }
            }
        ]
    }
}
// Default flight number to use when no launches exist in the database
const DEFAULT_FLIGHT_NUMBER = 100;

// Saves a launch to the database, creating a new document if one doesn't already exist
async function saveLaunch(launch) {
    try {
        await launchesDatabase.findOneAndUpdate(
            { flightNumber: launch.flightNumber },
            launch,
            { upsert: true }
        )
    } catch (error) {
        console.error(error.message)
    }
}

// Schedules a new launch by adding it to the database
async function scheduleNewLaunch(launch) {
    try {
        // Find the planet in the planet collection
        // corresponding to the launch target
        const planet = await planets.findOne({ keplerName: launch.target });

        // Throw an error if no matching planet is found
        if (!planet) {
            throw new Error('No matching planet found');   
        }

        // Get the flight number of the new launch and create a new launch object
        let newFlightNumber = await getlatestFlightNumber() + 1;

        const newLaunch = Object.assign(launch,
            {
                flightNumber: newFlightNumber,
                customers: ['OBINNA'],
                upcoming: true,
                success: true,
            }
        )

        // Save the new launch to the database
        await saveLaunch(newLaunch)
    } catch (error) {
        console.error(error.message)
    }
}

// Populates the launches collection in the database with data from the SpaceX API
async function populateLauches() {
    try {
        const response = await axios.post(SPACEX_API_URL, QUERY_API)
        
        // Throw an error if the response status is not 200
        if (response.status !== 200) {
            throw new Error('Launch data download failed');
        }
        
        const launchDocs = response.data.docs
        
         // Loop through the launch documents and extract necessary data
        for (const launchDoc of launchDocs) {
            const payloads = launchDoc.payloads
            // for each payload map customers into a single array of customers
            const customers = payloads.flatMap(payload => payload.customers);

            const launch = {
                flightNumber: launchDoc.flight_number,
                mission: launchDoc.name,
                rocket: launchDoc.rocket.name,
                launchDate: launchDoc.date_local,
                customers: customers,
                upcoming: launchDoc.upcoming,
                success: launchDoc.success
            }
            // Save the launch data to the database
            await saveLaunch(launch);
        }
        console.log(`${launchDocs.length} total launches Documents found!`)
    } catch (error) {
        console.error(error);
    }
}

// Loads launch data and populates the database if necessary
async function loadLaunchData() {
    try {
        // Check if the first launch is already in the database
        const firstLaunch = await findLaunch({
            flightNumber: 1,
            rocket: 'Falcon 1',
            mission: 'FalconSat',
        })

        // If the first launch is already in the database, log a message
        if (firstLaunch) {
            console.log('launch data already in the database')
        } else {
            // If the first launch is not in the database, 
            // populate the database with launch data
            await populateLauches()
        }
    } catch (error) {
        console.error(error);
    }
}

// Gets launch data from the database and applies sorting, skipping, and limiting
async function getAllLaunches(skip, limit) {
    try {
        return await launchesDatabase
            .find({}, { '_id': 0, '__v': 0 })
            .sort({flightNumber: 1})
            .skip(skip)
            .limit(limit)
    } catch (error) {
        console.error(error.message)
    }
}

// Gets the flight number of the latest launch from the database
async function getlatestFlightNumber() {
    try {
        const latestLaunch = await launchesDatabase
            .findOne()
            .sort('-flightNumber');
        
        // If there are no launches in the database, return the default flight number
        if (!latestLaunch) {
            return DEFAULT_FLIGHT_NUMBER;
        }

        // Return the flight number of the latest launch
        return latestLaunch.flightNumber 
    } catch (error) {
        console.error(error.message)
    }
}

// Finds a launch in the database that matches the specified filter
async function findLaunch(filter) {
    try {
        return await launchesDatabase.findOne(filter)
    } catch (error) {
        console.error(error.message)
    }
}

// Determines if a launch with the specified flight number exists in the database
async function existedLaunchesWithId(launchId) {
    try {
        return await findLaunch({ flightNumber: launchId });
    } catch (error) {
        console.error(error.message)
    }
}

// Aborts a launch with the specified ID by updating its upcoming and success
async function abortLaunchById(launchId) {
    try {
        const aborted = await launchesDatabase.updateOne(
            { flightNumber: launchId },
            { upcoming: false, success: false }
        )
        return aborted.modifiedCount === 1;
    } catch (error) {
        console.error(error.message)
    }   
}

module.exports = {
    scheduleNewLaunch,
    loadLaunchData,
    getAllLaunches,
    existedLaunchesWithId,
    abortLaunchById
};