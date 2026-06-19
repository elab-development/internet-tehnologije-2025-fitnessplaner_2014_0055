const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/workout-plans', require('./routes/workoutPlans'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/daily-logs', require('./routes/dailyLogs'));
app.use('/api/foods', require('./routes/foods'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
