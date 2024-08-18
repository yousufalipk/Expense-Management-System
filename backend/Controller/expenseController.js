const express = require('express');
const catchAsyncErrors = require('../Middleware/catchAsyncErrors');
const UserModel = require('../models/userModel');
const ExpenseModel = require('../models/expenseModel');

exports.addExpense = catchAsyncErrors(async (req, res, next) => {
    try{
        const {date, category, description, amount, userId} = req.body;

        const isUser = await UserModel.findById(userId);
        if(!isUser){
            return res.status(200).json({
                status: 'failed',
                message: 'User not found!'
            })
        }
        
        if(amount<0){
            return res.status(200).json({
                status: 'failed',
                message: 'Invalid Amount!'
            })
        }

        const newExpense = new ExpenseModel({
            date, 
            category,
            description,
            amount,
            userId
        })

        //Pushing New Expense Id to myExpenses array of User. 
        isUser.myExpenses.push(newExpense._id);
        await isUser.save();

        await newExpense.save();

        return res.status(200).json({
            status: 'success', 
            message: 'Expense Added Succesfuly!'
        })
    }catch(error){
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed', 
            message: 'Internal Server Error'
        })
    }
});

exports.removeExpense = catchAsyncErrors(async (req, res, next) => {
    try{
        const {expenseId} = req.body;

        // Find and delete the expense
        const expense = await ExpenseModel.findByIdAndDelete(expenseId);

        if (!expense) {
            return res.status(200).json({
                status: 'failed',
                message: 'Expense not found!'
            });
        }

        // Find the user associated with the expense
        const user = await UserModel.findById(expense.userId);

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found!'
            });
        }

        // Remove the expense from the user's list
        const index = user.myExpenses.indexOf(expenseId);
        if (index >= -1) {
            user.myExpenses.splice(index, 1);
            await user.save();
        }

        return res.status(200).json({
            status: 'success', 
            message: 'Expense Removed Succesfuly!'
        })
    }catch(error){
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed', 
            message: 'Internal Server Error'
        })
    }
});

exports.fetchExpenses = catchAsyncErrors(async (req, res, next) => {
    try{
        const {userId} = req.body;

        const isUser = await UserModel.findById(userId);

        if(!isUser){
            return res.status(200).json({
                status: 'failed',
                message: 'User not found!'
            })
        }

        const expenseIds = isUser.myExpenses;

        if (expenseIds.length === 0) {
            return res.status(200).json({
                status: 'failed',
                message: 'No expenses found!',
                expenses: []
            });
        }

        // Retrieve expenses using the IDs
        const expenses = await ExpenseModel.find({ _id: { $in: expenseIds } });

        // Return the expenses in the response
        return res.status(200).json({
            status: 'success',
            expenses: expenses
        });
    }catch(error){
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed', 
            message: 'Internal Server Error'
        })
    }
});