const jwt = require('jsonwebtoken');
const RefreshTokenModel = require('../models/token');

const dotenv = require('dotenv');
dotenv.config();

const RefereshTokenSecret = process.env.REFRESH_TOKEN;
const AccessTokenSecret = process.env.ACCESS_TOKEN;

class JWTService{ 
    //Sign access token 
    static signAccessToken(payload, expiryTime){
        return jwt.sign(payload, AccessTokenSecret, {expiresIn: expiryTime});
    }
    //sign refresh token
    static signRefreshToken(payload, expiryTime){
        return jwt.sign(payload, RefereshTokenSecret, {expiresIn: expiryTime});
    }

    //verify access token 
    static verifyAccessToken(token){
        return jwt.verify(token, AccessTokenSecret);
    }
    //verify refresh token 
    static verifyRefreshToken(token){
        return jwt.verify(token, RefereshTokenSecret);
    }

    //store refresh token
    static async storeRefreshToken(token, userId){
        try{
            const newToken = new RefreshTokenModel({
                token: token, 
                userId: userId
            })

            //store in db 
            await newToken.save();


        }catch(error){
            console.log(error);
        }
    }
}

module.exports = JWTService;