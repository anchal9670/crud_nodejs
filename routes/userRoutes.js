const express = require("express");
const router = express.Router()
const userController = require("../controllers/userController");
const {isAuth} = require('../middleware/auth');

router.post('/upload/files', userController.uploadFile);
router.patch('/user/update',isAuth, userController.updateUser);
router.get('/user/my',isAuth , userController.getUser);
router.delete('/user/delete',isAuth , userController.deleteUser);

module.exports = router;