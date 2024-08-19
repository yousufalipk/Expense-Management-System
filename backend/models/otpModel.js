const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    otp: {
        type: Number, 
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 10 * 60 * 1000 // 10 minutes from now
    }
},{
    timestamps: true
})

// Index for automatic deletion of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model('Otps', otpSchema);

module.exports = Otp;