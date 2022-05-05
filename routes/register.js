const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

//load validator
const validators = require("../validators/req-validator")


router.post('/register', validators.userCreationValidator, userController.registerUser);

router.post('/login', validators.loginValidator, userController.loginUser);

router.get('/get', validators.tokenValidator, userController.returnUser);

router.put('/delete', validators.tokenValidator, userController.deleteUser);

router.get('/list/:page', userController.getUserData);

module.exports = router;    