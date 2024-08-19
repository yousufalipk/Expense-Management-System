const JWTService = require('../services/JWTService');
const UserModel = require('../models/userModel');
const UserDTO = require('../Dto/user');

const auth = async (req, res, next) => {
    try {
        // 1. Retrieve tokens from cookies
        const { refreshToken, accessToken } = req.cookies;

        // 2. Check if both tokens are present
        if (!refreshToken || !accessToken) {
            return res.status(200).json({
                status: 'failed',
                message: 'Authorization tokens are missing.'
            });
        }

        let userId;

        try {
            // 3. Verify access token
            const decodedAccessToken = JWTService.verifyAccessToken(accessToken);
            userId = decodedAccessToken._id;
        } catch (error) {
            return res.status(200).json({
                status: 'failed',
                message: 'Invalid or expired access token.'
            });
        }

        let user;

        try {
            // 4. Fetch user from the database
            user = await UserModel.findById(userId);
        } catch (error) {
            return res.status(200).json({
                status: 'failed',
                message: 'Internal server error while fetching user data.'
            });
        }

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found.'
            });
        }

        // 5. Attach user data to request
        const userDto = new UserDTO(user);
        req.user = userDto;

        // 6. Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'An unexpected error occurred.'
        });
    }
};

module.exports = auth;
