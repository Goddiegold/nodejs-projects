// Importing required model
const { getAllPlanets } = require('../../models/planets/planets.model');

// Function to retrieve all planet
async function httpGetAllPlanets(req, res) {
    try {
        return res.status(200).json(await getAllPlanets());
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    httpGetAllPlanets
}