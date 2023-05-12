const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const api = require('./routes/api')

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('combined'));
app.use(express.json());

app.use('/api/v1', api);
app.get('/', (req, res) => res.send('Hello WOrld!'))

module.exports = app;