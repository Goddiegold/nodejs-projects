const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const api = require('./routes/api')

const app = express();

// Security configuration
app.use(helmet());
app.use(cors());
app.options('*', cors())

// Enable parsing Json payload  in the request body
app.use(express.json());

// Logs information about incoming requests and outgoing responses in the terminal
app.use(morgan('combined'));

// Routes
app.use('/api/v1', api);

module.exports = app;