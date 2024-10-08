const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const mpoxRoutes = require('./routes/mpoxRoutes');

app.use(cors({
        origin: 'http://localhost:3000'  
    }));
//app.use(express.json());
app.use('/api', apiRoutes);
app.use('/mpox', mpoxRoutes);


module.exports = app;