const express = require('express');
const QRCode = require('qrcode');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./mylinks.db');

// Creazione tabella se non esiste
db.run(`CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  original_url TEXT,
  short_code TEXT,
  short_clicks INTEGER DEFAULT 0,
  qr_scans INTEGER DEFAULT 0
)`);

app.post('/api/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL mancante" });

  const code = uuidv4().slice(0,6); // short code
  const id = uuidv4();

  db.run(
    `INSERT INTO links (id, original_url, short_code) VALUES (?, ?, ?)`,
    [id, url, code]
  );

  const qrData = await QRCode.toDataURL(`https://mylinks.vercel.app/api/s/${code}`);

  res.json({
    original_url: url,
    short_url: `https://mylinks.vercel.app/api/s/${code}`,
    qr_url: qrData
  });
});

module.exports = app;