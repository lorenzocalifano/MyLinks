const express = require('express');
const QRCode = require('qrcode');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.post('/api/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL mancante" });

  const code = uuidv4().slice(0,6);

  // inserisci nel DB
  const { data, error } = await supabase
    .from('links')
    .insert([{ original_url: url, short_code: code, short_clicks: 0, qr_scans: 0 }]);

  if (error) return res.status(500).json({ error: error.message });

  const qrData = await QRCode.toDataURL(`https://${process.env.VERCEL_URL}/api/s/${code}`);

  res.json({
    original_url: url,
    short_url: `https://${process.env.VERCEL_URL}/api/s/${code}`,
    qr_url: qrData
  });
});

module.exports = app;