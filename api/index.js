const express = require('express');
const shorten = require('./api/shorten');
const redirect = require('./api/redirect');
const stats = require('./api/stats');

const app = express();
app.use(express.json());

// tutte le rotte da api/
app.use('/api', shorten);
app.use('/api', redirect);
app.use('/api', stats);

module.exports = app;