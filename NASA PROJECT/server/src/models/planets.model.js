const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const filePath = path.join(__dirname, '../../data/kepler_data.csv');

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    await savePlanet(data)
                }
            })
            .on('error', err => {
                reject(err);
            })
            .on('end', async () => {
                try {
                    const result = await getAllPlanets();
                    const planetNames = result.map(planet => planet['keplerName']);
                    console.log({ planetNames });
                    console.log(`${planetNames.length} habitable planets found`);
                    resolve();
                } catch (e) {
                    console.error(e.message);
                    reject(e);
                }
            });
    })
}

async function getAllPlanets() {
    try {
        const result = await planets.find({}, {'_id': 0, '__v': 0});
        return result;
    } catch (e) {
        console.error(e.message)
    }
}

// insert + update = upsert
// DONE: replace below create with insert + update = upsert
async function savePlanet(planet) {
    try {
        await planets.updateOne(
            { keplerName: planet.kepler_name },
            { keplerName: planet.kepler_name },
            { upsert: true }
        )
    } catch (e) {
        console.error(e.message)
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}