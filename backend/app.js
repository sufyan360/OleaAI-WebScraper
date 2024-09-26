const express = require('express');
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const mpoxRoutes = require('./routes/mpoxRoutes');

app.use(express.json());
app.use('/api', apiRoutes);
app.use('/mpox', mpoxRoutes);

module.exports = app;