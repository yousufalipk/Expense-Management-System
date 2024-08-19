const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const user = require('./Routes/userRoutes');
const expense = require('./Routes/expenseRoutes');

const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;
const FRONTEND_DEPLOYEMENT = process.env.FRONTEND_DEPLOYEMENT;

const app = express();

app.use(cookieParser());


// List of allowed origins
const allowedOrigins = ['https://expense-management-system-frontend-beta.vercel.app', 'https://vercel.com/yousuf-bhatti-s-projects/expense-management-system-frontend/ATobKWjaBf776DbxE3NiUntj1PHA'];

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));



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
