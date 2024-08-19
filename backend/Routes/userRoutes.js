const express = require('express');
const router = express.Router();

const auth = require('../Middleware/auth');

const {  
    createUser,
    loginUser,
    logOutUser,
    refresh,
    generateOtp,
    verifyOtp
} = require('../Controller/userController');

//Create User
router.route('/create-user').post(createUser);

//Login User
router.route('/login-user').post(loginUser);

//Log Out user
router.get('/logout-user', auth, logOutUser);

//Refresh page
router.route('/refresh').get(refresh);

//Generate otp
router.route('/generate-otp').post(generateOtp);

//Verify Otp
router.route('/verify-otp').post(verifyOtp);

module.exports = router;

