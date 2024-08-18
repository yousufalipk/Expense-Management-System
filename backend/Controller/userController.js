const express = require('express');
const catchAsyncErrors = require('../Middleware/catchAsyncErrors');
const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const UserDto = require('../Dto/user');
const JWTService = require('../services/JWTService');
const RefreshTokenModel = require('../models/token');

exports.createUser = catchAsyncErrors(async (req,res,next)=> {
    try{
        const {fname, lname, email, password, confirmPassword } = req.body;

        const exisitingUser = await UserModel.findOne({ email });  

        if(exisitingUser){
            return res.status(200).json({
                status: 'failed', 
                message: 'Account already created!'
            });
        }

        if(password !== confirmPassword){
            return res.status(200).json({
                status: 'failed',
                message: "Password did't Match!"
            });
        }

        //hashing Password before saving 
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const hashedPassword = await bcrypt.hash(password, salt);

        let accessToken, refreshToken;

        const newUser = new UserModel({
            fname,
            lname,
            email,
            password: hashedPassword
        })

        const user = await newUser.save();

        //Token generation 
        accessToken = JWTService.signAccessToken({_id: user._id, email: user.email }, '30m');
        refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');

        //store refresh token in db 
        await JWTService.storeRefreshToken(refreshToken, user._id);

        //Send token in Cookies
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24, 
            httpOnly: true, 
            sameSite: "None",
            secure: true
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24, 
            httpOnly: true, 
            sameSite: "None", 
            secure: true
        });

        const userDto = new UserDto(user);

        return res.status(200).json({
            status: 'success', 
            user: userDto,
            auth: true
        })
    }catch(error){
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed', 
            message: 'Internal Server Error'
        })
    }
});

exports.loginUser = catchAsyncErrors(async (req,res,next)=> {
    try{
        const {email, password} = req.body;

        const user = await UserModel.findOne({email: email});

        if(!user){
            return res.status(200).json({
                status: 'failed',
                message: 'User not found!'
            })
        }

        //Comparing Password with hashed saved pass
        const match = await bcrypt.compare(password, user.password);

        if(!match){
            return res.status(200).json({
                status: 'failed', 
                message: 'Invalid Password'
            })
        }   

        //Token Generation 
        let accessToken, refreshToken;

        accessToken = JWTService.signAccessToken({_id: user._id, email: user.email}, '30m');
        refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');

        //Update refresh Token in database
        await RefreshTokenModel.updateOne(
            { userId: user._id },  
            { $set: { token: refreshToken } }, 
            { upsert: true } 
        );
        
        
        //Send Tokens in cookies 

        res.cookie('accessToken' , accessToken , {
            maxAge: 1000 * 60 * 60 * 24, 
            httpOnly: true,
            sameSite: "None", 
            secure: true
        })

        res.cookie('refreshToken', refreshToken, {
            maxAge : 1000 * 60 * 60 * 24, 
            httpOnly: true,
            sameSite: "None",
            secure: true
        })

        const userDto = new UserDto(user);

        return res.status(200).json({
            status: 'success', 
            user: userDto ,
            auth: true
        })
    }catch(error){
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed', 
            message: 'Internal Server Error!'
        })
    }
});

exports.logOutUser = catchAsyncErrors(async (req,res,next)=> {
    try{
        //Delete refresh token from db
        const { refreshToken } = req.cookies;

        await RefreshTokenModel.deleteOne({token: refreshToken});

       // delete cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        // Response
        return res.status(200).json({
            status: 'success', 
            user: null, 
            auth: false
        })
    }catch(error){
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed', 
            message: 'Internal Server Error'
        })
    }
});

exports.refresh = catchAsyncErrors(async (req,res,next) => {
    try{
        const originalRefreshToken = req.cookies.refreshToken;

        let id;

        try {
            id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
        } catch (e) {

            return res.status(200).json({
                status: 'failed', 
                message: 'Untuthorizred'
            })
        }

        try {
        const match = RefreshTokenModel.findOne({
            _id: id,
            token: originalRefreshToken,
        });

        if (!match) {
            return res.status(200).json({
                status: 'failed', 
                message: 'Untuthorizred'
            })
        }
        } catch (e) {
            return res.status(200).json({
                status: 'failed', 
                message: 'Untuthorizred'
            })
        }

        try {
        const accessToken = JWTService.signAccessToken({ _id: id }, "30m");

        const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

        await RefreshTokenModel.updateOne({ _id: id }, { token: refreshToken });

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            sameSite: "None",
            secure: true
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpsOnly: true,
            sameSite: "None", 
            secure: true
        });
        } catch (e) {
            return res.status(200).json({
                status: 'failed', 
                message: 'Untuthorizred'
            })
        }

        const user = await UserModel.findOne({ _id: id });

        const userDto = new UserDto(user);

        return res.status(200).json({ user: userDto, auth: true });
        
    }catch(error){
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed', 
            message: 'Internal Server Error'
        })
    }
})
