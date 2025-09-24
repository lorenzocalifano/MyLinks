const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get('/api/s/:code', async (req, res) => {
  const code = req.params.code;

  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('short_code', code)
    .single();

  if (error || !data) return res.status(404).send("Link non trovato");

  // increment click
  await supabase
    .from('links')
    .update({ short_clicks: data.short_clicks + 1 })
    .eq('short_code', code);

  res.redirect(data.original_url);
});

module.exports = app;