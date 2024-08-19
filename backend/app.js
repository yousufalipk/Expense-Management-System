const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");

const user = require('./Routes/userRoutes');
const expense = require('./Routes/expenseRoutes');

const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;
const FRONTEND_DEPLOYEMENT = process.env.FRONTEND_DEPLOYEMENT;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    FRONTEND_DOMAIN,
    FRONTEND_DEPLOYEMENT
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

// Use '/api/v1' for user routes
app.use('/api/v1', user);
// Use '/api/v1/expense' for expense routes
app.use('/api/v1/expense', expense);

// Test route
app.get('/', (req, res) => {
    res.send('Server Runs Correctly');
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
