const express = require('express');
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const mpoxRoutes = require('./routes/mpoxRoutes');
const notebookRoutes = require('./routes/notebookRoutes');

app.use(express.json());
app.use('/api', apiRoutes);
app.use('/mpox', mpoxRoutes);
app.use('/api', notebookRoutes);

module.exports = app;