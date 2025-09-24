const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get('/api/stats/:code', async (req, res) => {
  const code = req.params.code;

  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('short_code', code)
    .single();

  if (error || !data) return res.status(404).json({ error: "Link non trovato" });

  res.json({
    original_url: data.original_url,
    short_url: `https://${process.env.VERCEL_URL}/api/s/${data.short_code}`,
    short_clicks: data.short_clicks,
    qr_scans: data.qr_scans
  });
});

module.exports = app;