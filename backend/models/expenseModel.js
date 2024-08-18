const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: {
        type: Date, 
        required: true,
        default: Date.now
    }, 
    category: {
        type: String, 
        required: true
    }, 
    description: {
        type: String, 
        required: true
    }, 
    amount: {
        type: Number, 
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    }
},
    {
        timestamps: true
})


const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;