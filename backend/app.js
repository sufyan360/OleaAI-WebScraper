const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const mpoxRoutes = require('./routes/mpoxRoutes');

app.use(cors({origin: `${process.env.NEXT_PUBLIC_API_BASE_URL}`}));
//app.use(express.json());
app.use('/api', apiRoutes);
app.use('/mpox', mpoxRoutes);


module.exports = app;