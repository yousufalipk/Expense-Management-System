const express = require('express');
const catchAsyncErrors = require('../Middleware/catchAsyncErrors');
const UserModel = require("../models/userModel");
const OtpModel = require("../models/otpModel");
const bcrypt = require('bcrypt');
const UserDto = require('../Dto/user');
const JWTService = require('../services/JWTService');
const RefreshTokenModel = require('../models/token');
const { generateRandomOtp } = require('../utils/generateOtp');
const nodemailer = require("nodemailer");

const NodeMailerUser = process.env.NODEMAILER_USER;
const NodeMailerPass = process.env.NODEMAILER_PASS;

exports.createUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const { fname, lname, email, password, confirmPassword } = req.body;

        const exisitingUser = await UserModel.findOne({ email });

        if (exisitingUser) {
            return res.status(200).json({
                status: 'failed',
                message: 'Account already created!'
            });
        }

        if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'failed',
                message: "Password didn't match!"
            });
        }

        // Hashing Password before saving
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await bcrypt.hash(password, salt);

        let accessToken, refreshToken;

        const newUser = new UserModel({
            fname,
            lname,
            email,
            password: hashedPassword,
            verified: false
        });

        const user = await newUser.save();

        //Generate 6 Digits Otp
        const otp = generateRandomOtp();

        // Set expiration time
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        const otpDoc = new OtpModel({
            userId: newUser._id,
            otp,
            expiresAt
        });

        await otpDoc.save();

         //NodeMailer Logic

         const transporter = nodemailer.createTransport({
            host: 'smtp.elasticemail.com',
            port: 2525,
            secure: false, // true for 465, false for other ports
            auth: {
                user: NodeMailerUser, // your email
                pass: NodeMailerPass // your password
            }
        });

        const mailOptions = {
            from: '"Expense Management System" yousufbhatti2002@gmail.com',
            to: user.email,
            subject: '🔒 OTP for Account Verification | Expense Management System',
            text: `Hello there! Your one-time passcode (OTP) to verify your account is: ${otp}. Enter it securely to proceed.`,
            html: `<p>Hello there!</p><p>Your one-time passcode (OTP) to verify your account is:</p><h2 style="font-size: 24px; color: #007bff;">${otp}</h2><p>Enter it securely to proceed. <p>Note: OTP will expire after 10 minutes!</p></p>`
        };
        

        try{
            await transporter.sendMail(mailOptions);
        }catch(e){
            console.log("Error", e);
            return res.status(200).json({
                status: "failed",
                message: "Error sending otp.."
            })
        }

        const userDto = new UserDto(user);

        return res.status(200).json({
            status: 'success',
            user: userDto,
            auth: false
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        });
    }
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found!'
            });
        }

        if (user.verified == false) {
            return res.status(200).json({
                status: 'failed',
                message: 'Account not verified!'
            })
        }

        // Comparing Password with hashed saved pass
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(200).json({
                status: 'failed',
                message: 'Invalid Password'
            });
        }

        // Token Generation 
        let accessToken, refreshToken;

        accessToken = JWTService.signAccessToken({ _id: user._id, email: user.email }, '30m');
        refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');

        // Update refresh Token in database
        await RefreshTokenModel.updateOne(
            { userId: user._id },
            { $set: { token: refreshToken } },
            { upsert: true }
        );

        // Send Tokens in cookies (Production settings)
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            httpOnly: true,
            sameSite: "None",
            secure: true // Only sent over HTTPS
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            httpOnly: true,
            sameSite: "None",
            secure: true // Only sent over HTTPS
        });

        const userDto = new UserDto(user);

        return res.status(200).json({
            status: 'success',
            user: userDto,
            auth: true
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error!'
        });
    }
});

exports.logOutUser = catchAsyncErrors(async (req, res, next) => {
    try {
        // Delete refresh token from db
        const { refreshToken } = req.cookies;

        const deleteRefreshToken = await RefreshTokenModel.deleteOne({ token: refreshToken });

        if (!deleteRefreshToken) {
            return res.status(200).json({
                status: 'failed',
                message: 'Error Logging Out!'
            })
        }

        // Delete cookies
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true // Only sent over HTTPS
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true // Only sent over HTTPS
        });

        // Response
        return res.status(200).json({
            status: 'success',
            user: null,
            auth: false
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        });
    }
});

exports.refresh = catchAsyncErrors(async (req, res, next) => {
    const originalRefreshToken = req.cookies.refreshToken;

    if (!originalRefreshToken) {
        return res.status(200).json({
            status: 'success',
            message: 'Refresh token is missing',
            auth: false
        });
        return res.status(200).json({
            status: 'failed',
            message: 'Refresh token is missing'
        });
    }

    let id;
    try {
        const decoded = JWTService.verifyRefreshToken(originalRefreshToken);
        id = decoded._id;
    } catch (e) {
        console.error('Token verification failed:', e.message);
        return res.status(200).json({
            status: 'failed',
            message: 'Token verification failed'
        });
    }

    try {
        const match = await RefreshTokenModel.findOne({ userId: id, token: originalRefreshToken });
        if (!match) {
            return res.status(200).json({
                status: 'failed',
                message: 'Unauthorized'
            });
        }

        const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
        const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

        await JWTService.storeRefreshToken(refreshToken, id);

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            httpOnly: true,
            sameSite: "None",
            secure: true // Only sent over HTTPS
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            httpOnly: true,
            sameSite: "None",
            secure: true // Only sent over HTTPS
        });

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found'
            });
        }

        const userDto = new UserDto(user);

        return res.status(200).json({
            status: 'success',
            user: userDto,
            auth: true
        });

    } catch (error) {
        console.error('Error', error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        });
    }
});

exports.generateOtp = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({email: email});

        if(!user){
            return res.status(200).json({
                status: 'failed',
                message: 'User not found!'
            })
        }


        const alreadyGenerated = await OtpModel.findOne({ userId: user._id });

        if (alreadyGenerated) {
            return res.status(200).json({
                status: 'failed',
                message: 'OTP requested recently, Try again after 10 Minutes!'
            })
        }


        //Generate 6 Digits Otp
        const otp = generateRandomOtp();

        // Set expiration time
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        //NodeMailer Logic

        const transporter = nodemailer.createTransport({
            host: 'smtp.elasticemail.com',
            port: 2525,
            secure: false, // true for 465, false for other ports
            auth: {
                user: NodeMailerUser, // your email
                pass: NodeMailerPass // your password
            }
        });

        const mailOptions = {
            from: '"Expense Management System" yousufbhatti2002@gmail.com',
            to: user.email,
            subject: '🔒 OTP for Account Verification | Expense Management System',
            text: `Hello there! Your one-time passcode (OTP) to verify your account is: ${otp}. Enter it securely to proceed.`,
            html: `<p>Hello there!</p><p>Your one-time passcode (OTP) to verify your account is:</p><h2 style="font-size: 24px; color: #007bff;">${otp}</h2><p>Enter it securely to proceed. <p>Note: OTP will expire after 10 minutes!</p></p>`
        };
        

        try{
            await transporter.sendMail(mailOptions);
        }catch(e){
            console.log("Error", e);
            return res.status(200).json({
                status: "failed",
                message: "Error sending otp.."
            })
        }


        const otpDoc = new OtpModel({
            userId: user._id,
            otp,
            expiresAt
        });

        await otpDoc.save();

        //NodeMailer Logic

        return res.status(200).json({
            status: 'success',
            message: 'OTP sent successfully',
        });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        })
    }
});

exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
    try {
        const { otp, email } = req.body;

        const user = await UserModel.findOne({email: email});

        if (!user) {
            res.status(200).json({
                status: "failed",
                message: 'Account not found!'
            })
        }

        const isOtp = await OtpModel.findOne({ userId: user._id });

        if (!isOtp) {
            res.status(200).json({
                status: "failed",
                message: 'Otp Expired'
            })
        }

        const generateOtp = isOtp.otp;

        if (otp == generateOtp) {
            //Changing Verified Status
            user.verified = true;
            await user.save();

            return res.status(200).json({
                status: 'success',
                message: 'Account Verified!'
            })
        }

        else {
            return res.status(200).json({
                status: 'failed',
                message: 'Invalid Otp!'
            })
        }
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        })
    }
});