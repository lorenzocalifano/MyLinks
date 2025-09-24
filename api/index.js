const express = require('express');
const shorten = require('./api/shorten');
const redirect = require('./api/redirect');
const stats = require('./api/stats');

const app = express();
app.use(express.json());

// monta tutte le rotte
app.use(shorten);
app.use(redirect);
app.use(stats);

module.exports = app;