const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const user = require('./Routes/userRoutes');
const expense = require('./Routes/expenseRoutes');

const apiUrl = process.env.FRONTEND_ORIGIN;

app.use(cors({
    origin: apiUrl,
    credentials: true 
}));

app.use(express.json());
app.use(bodyParser.json()); 
app.use(cookieParser());

// Use '/api/v1/' for user routes
app.use('/api/v1', user);
// Use '/api/v1/expense' for expense routes
app.use('/api/v1/expense', expense);

// Test route
app.get('/', (req, res) => {
    res.send('Server Runs Correctly');
});


module.exports = app;
