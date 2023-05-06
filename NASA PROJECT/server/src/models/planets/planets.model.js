// Import required modules
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

// Import planets module, which provides functions 
// to interact with the planets collection in the database
const planets = require('./planets.mongo');

// Constants used to filter the planets by their characteristics
const KOI_DISPOSITION_CONFIRMED = 'CONFIRMED';
const KOI_INSOL_MIN = 0.36;
const KOI_INSOL_MAX = 1.11;
const KOI_PRAD_MAX = 1.6;

// Check if a planet is habitable based on its characteristics
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === KOI_DISPOSITION_CONFIRMED
        && planet['koi_insol'] > KOI_INSOL_MIN
        && planet['koi_insol'] < KOI_INSOL_MAX
        && planet['koi_prad'] < KOI_PRAD_MAX;
}

// Path to the kepler_data.csv file
const filePath = path.join(__dirname, '../../../data/kepler_data.csv');

// Load the data from the kepler_data.csv file into the planets collection
function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            // Use csv-parse to read the csv file
            .pipe(parse({ comment: '#', columns: true }))
            .on('data', async (data) => {
                // Check if the planet is habitable
                if (isHabitablePlanet(data)) {
                    try {
                        // Save the planet to the database
                        await savePlanet(data)
                    } catch (error) {
                        // If there's an error saving the planet, reject the promise
                        reject(error)
                    }
                }
            })
            .on('error', (err) => reject(err))
            // When the file has been fully read, resolve the promise
            .on('end', async () => {
                try {
                    // Get all the planets from the database
                    const countPlanetsFound = (await getAllPlanets()).length;
                    console.log(`${countPlanetsFound} habitable planets found!`);
                    // Resolve the promise with no value
                    resolve();
                } catch (err) {
                    // If there's an error getting the planets from the database, log the error
                    console.error(err);
                }
            });
    });
}

// Save a planet to the database
async function savePlanet(planet) {
    await planets.updateOne(
        // Use the keplerName as the query parameter to find the planet in the collection
        { keplerName: planet.kepler_name },
        // Use the same keplerName to update the planet object 
        // if it already exists, or create a new planet if it doesn't exist
        { keplerName: planet.kepler_name },
        { upsert: true }
    )
}

// Get all the planets from the database and exclude the _id and __v fields from the result
async function getAllPlanets() {
    return planets.find({}, { '_id': 0, '__v': 0 });
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}