const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
