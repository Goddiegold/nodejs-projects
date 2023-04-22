const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const habitablePlanet = [];

const filePath = path.join(__dirname, '../../data/kepler_data.csv');

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', data => {
                if (isHabitablePlanet(data)) {
                    habitablePlanet.push(data);
                }
            })
            .on('error', err => {
                reject(err);
            })
            .on('end', () => {
                console.log(habitablePlanet.map(planet => planet['kepler_name']));
                resolve();
            });
    })
}

function getAllPlanets() {
    return planets = habitablePlanet;
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}