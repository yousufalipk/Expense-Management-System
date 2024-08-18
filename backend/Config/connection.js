const express = require('express');
const mongoose = require('mongoose');

//env configuration
const dotenv = require('dotenv'); 
dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;

const connectToDb = () => {
    return (
        mongoose
        .connect(MONGO_DB_URI)
        .then((val) => {
            console.log("Database Connection Successful!")
        }
        )
        .catch((val) => {
            console.log("Mongo Db URI" , MONGO_DB_URI);
            console.log("Database Connection Failed!")
        }
        )
    )
}; 

module.exports = connectToDb;