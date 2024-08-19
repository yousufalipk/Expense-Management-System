const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const user = require('./Routes/userRoutes');
const expense = require('./Routes/expenseRoutes');

const app = express();

app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: 'https://expense-management-system-frontend-beta.vercel.app',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version'],
        credentials: true,
        optionsSuccessStatus: 200
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
