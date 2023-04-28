const http = require('http');

const  mongoose = require('mongoose');

const { loadPlanetsData } = require('./models/planets.model');

require("dotenv").config({ path: ".env" });

const PORT = process.env.PORT || 8000;

const MONGO_URL = process.env.MONGO_URL;

const app = require('./app');

const server = http.createServer(app)

mongoose.connection.once('open', () => console.log('MongoDB connection is ready'));

mongoose.connection.on('error', err => console.error(err));

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URL)

        await loadPlanetsData();

        server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
    } catch (e) {
        console.error(e.message);
    }
}

startServer();