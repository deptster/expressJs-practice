const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

//load validator
const validators = require("../validators/req-validator")


router.post('/register', validators.userCreationValidator, userController.registerUser);

router.post('/login', validators.loginValidator, userController.loginUser);

router.get('/get/:id', validators.tokenValidator, userController.returnUser);

router.put('/delete', validators.tokenValidator, userController.deleteUser);

router.get('/list/:page', userController.getUserData);

router.post('/address', validators.tokenValidator, validators.addressValidator, userController.userAddress);

module.exports = router;    