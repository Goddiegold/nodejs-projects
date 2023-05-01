const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) {
    try {
        return res.status(200).json(await getAllPlanets());
    } catch (e) {
        console.error(e.message);
    }
}

module.exports = {
    httpGetAllPlanets
}