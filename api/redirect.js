const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const db = new sqlite3.Database('./mylinks.db');

app.get('/api/s/:code', (req, res) => {
  const code = req.params.code;
  db.get(`SELECT * FROM links WHERE short_code = ?`, [code], (err, row) => {
    if (err || !row) return res.status(404).send("Link non trovato");

    // increment click
    db.run(`UPDATE links SET short_clicks = short_clicks + 1 WHERE short_code = ?`, [code]);

    res.redirect(row.original_url);
  });
});

module.exports = app;