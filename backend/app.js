// const express = require('express');
// const app = express();
// const cors = require('cors');
// const apiRoutes = require('./routes/apiRoutes');
// const mpoxRoutes = require('./routes/mpoxRoutes');

// //replace with `${process.env.NEXT_PUBLIC_API_BASE_URL}` after testing
// app.use(cors({
//     origin: 'https://oleaai-webscraper-git-sufyan-p-2b07ce-sufyan-chaudhrys-projects.vercel.app',
//     methods: 'GET, POST',
// }));
// //app.use(express.json());
// app.use('/api', apiRoutes);
// app.use('/mpox', mpoxRoutes);


// module.exports = app;

const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const mpoxRoutes = require('./routes/mpoxRoutes');

// Set up CORS dynamically to allow both localhost and Vercel domains
const allowedOrigins = [
    'http://localhost:3000', // Local development frontend
    'https://oleaai-webscraper-git-sufyan-p-2b07ce-sufyan-chaudhrys-projects.vercel.app', // Production frontend on Vercel
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: 'GET, POST',
}));

// Parse JSON bodies
app.use(express.json()); // Use this middleware if you're handling JSON payloads in POST requests

// Set up routes
app.use('/api', apiRoutes);
app.use('/mpox', mpoxRoutes);

module.exports = app;
