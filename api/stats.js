const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const db = new sqlite3.Database('./mylinks.db');

app.get('/api/stats/:code', (req, res) => {
  const code = req.params.code;
  db.get(`SELECT * FROM links WHERE short_code = ?`, [code], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Link non trovato" });

    res.json({
      original_url: row.original_url,
      short_url: `https://mylinks.vercel.app/api/s/${row.short_code}`,
      short_clicks: row.short_clicks,
      qr_scans: row.qr_scans
    });
  });
});

module.exports = app;