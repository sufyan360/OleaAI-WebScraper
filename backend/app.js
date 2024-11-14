const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const mpoxRoutes = require('./routes/mpoxRoutes');

//replace with `${process.env.NEXT_PUBLIC_API_BASE_URL}` after testing
app.use(cors({
    origin: 'https://oleaai-webscraper-git-sufyan-p-2b07ce-sufyan-chaudhrys-projects.vercel.app',
    methods: 'GET, POST',
}));
//app.use(express.json());
app.use('/api', apiRoutes);
app.use('/mpox', mpoxRoutes);


module.exports = app;