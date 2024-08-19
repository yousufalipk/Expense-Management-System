const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const user = require('./Routes/userRoutes');
const expense = require('./Routes/expenseRoutes');

const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;
const FRONTEND_DEPLOYEMENT = process.env.FRONTEND_DEPLOYEMENT;

const app = express();

app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: {
          FRONTEND_DOMAIN, 
          FRONTEND_DEPLOYEMENT
        },
        credentials: true,
    })
);

app.use(express.json());

// Use '/api/v1' for user routes
app.use('/api/v1', user);
// Use '/api/v1/expense' for expense routes
app.use('/api/v1/expense', expense);

// Test route
app.get('/', (req, res) => {
    res.send('Server Runs Correctly');
});

module.exports = app;
