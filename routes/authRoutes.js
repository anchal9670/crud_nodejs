const express = require("express");
const router = express.Router()
const authController = require('../controllers/authController');
const {isAuth} =  require('../middleware/auth');

// Routes
router.post('/auth/signup', authController.signUp);
router.post('/auth/login', authController.logIn);
router.post('/auth/refresh', isAuth ,authController.Refresh);
router.put('/auth/changepassword',isAuth, authController.changePassword);
router.get('/auth/logout' ,isAuth , authController.logout);

module.exports = router;