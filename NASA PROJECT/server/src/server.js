const http = require('http');

const { mongooseConnect } = require('../src/utils/mongo');

const { loadPlanetsData } = require('./models/planets.model');

require("dotenv").config();

const PORT = process.env.PORT || 8000;

const app = require('./app');

const server = http.createServer(app)

const startServer = async () => {
    try {
        await mongooseConnect();

        await loadPlanetsData();

        server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
    } catch (e) {
        console.error(e.message);
    }
}

startServer();