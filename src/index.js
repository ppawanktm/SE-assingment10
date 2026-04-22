const express = require('express');
const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'workshop-app' });
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[health] db check failed:', err.message);
    res.status(503).json({ status: 'error', reason: 'db_unavailable' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title FROM tasks ORDER BY id ASC');
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error('[tasks] query failed:', err.message);
    res.status(500).json({ error: 'query_failed' });
  }
});

app.listen(PORT, () => {
  console.log(`workshop-app listening on :${PORT}`);
});
