// Import the required modules
const mongoose = require('mongoose');

require("dotenv").config();

// Get the MongoDB connection URL from the environment variable
const MONGO_URL = process.env.MONGO_URL;

// Log a message when the MongoDB connection is established
mongoose.connection.once('open', () => console.log('MongoDB connection is ready'));

// Log an error message if there is an error in the MongoDB connection
mongoose.connection.on('error', err => console.error(err.message));

// Define a function to establish a connection to the MongoDB database
async function mongooseConnect() {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.error(error.message);
    }
}

// Define a function to disconnect from the MongoDB database
async function mongooseDisconnect() {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    mongooseConnect,
    mongooseDisconnect
};