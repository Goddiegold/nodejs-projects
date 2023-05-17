const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const api = require('./routes/api')

const app = express();

// Security configuration
app.use(helmet());
app.use(cors());
app.options('*', cors())

// Enable parsing Json payload  in the request body
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
    
    next()
});

// Logs information about incoming requests and outgoing responses in the terminal
app.use(morgan('combined'));

// Routes
app.use('/public/uploads', express.static(__dirname + '/../public/uploads'));
app.use('/api/v1', api);

module.exports = app;