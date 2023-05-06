// Import the necessary modules
const http = require('http');

require("dotenv").config();

const app = require('./app');
const { mongooseConnect } = require('../src/utils/mongo');
const { loadPlanetsData } = require('./models/planets/planets.model');
const { loadLaunchData } = require('./models/launches/launches.model');

// Set the server's port
const PORT = process.env.PORT || 8000;

// Create the HTTP server using the app
const server = http.createServer(app)

// Define an async function to start the server
const startServer = async () => {
    try {
        // Connect to MongoDB and load the necessary data
        await mongooseConnect();
        await loadPlanetsData();
        await loadLaunchData();

        // Start the server and log a message to the console
        server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
    } catch (error) {
        console.error(error.message);
    }
}

// Call the startServer function to start the server
startServer();