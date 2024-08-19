const jwt = require('jsonwebtoken');
const RefreshTokenModel = require('../models/token');
const dotenv = require('dotenv');

dotenv.config();

const RefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const AccessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

class JWTService { 
    // Sign access token
    static signAccessToken(payload, expiryTime) {
        return jwt.sign(payload, AccessTokenSecret, { expiresIn: expiryTime });
    }

    // Sign refresh token
    static signRefreshToken(payload, expiryTime) {
        return jwt.sign(payload, RefreshTokenSecret, { expiresIn: expiryTime });
    }

    // Verify access token
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, AccessTokenSecret);
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    // Verify refresh token
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, RefreshTokenSecret);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    // Store refresh token
    static async storeRefreshToken(token, userId) {
        try {
            const existingToken = await RefreshTokenModel.findOne({ userId });
            if (existingToken) {
                existingToken.token = token;
                await existingToken.save();
            } else {
                // Store new token
                const newToken = new RefreshTokenModel({
                    token: token, 
                    userId: userId
                });
                await newToken.save();
            }
        } catch (error) {
            console.error('Error storing refresh token:', error);
        }
    }
}

module.exports = JWTService;
