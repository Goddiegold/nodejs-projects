const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launches.router')

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
 
app.use(express.json());

app.use(planetsRouter)

app.use(launchesRouter);

module.exports = app;