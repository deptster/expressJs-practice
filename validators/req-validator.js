const {check, validationResult} = require('express-validator')

const userCreationValidator = [
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username can not be empty!'),
    check('email','email must not be empty').not().isEmpty(),
    check('password','password must not be empty').not().isEmpty(),
    check('confirm','confirm password must not be empty').not().isEmpty(),
    check('first_name','first name must not be empty').not().isEmpty(),
    check('last_name','last name must not be empty').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});
        next();
    }
]

const loginValidator = [
    check('username','Username must not be empty').not().isEmpty(),
    check('password','password must not be empty').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});
        next();
    }
]

const tokenValidator = [
    check('accessToken','accessToken Cannot be empty')
    .not()
    .isEmpty()
    .isLength(24)
    .withMessage('Character length should be 24'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        return res.status(422).json({errors : errors.array()});
        next();
    }
]


module.exports = {
    userCreationValidator,
    loginValidator,
    tokenValidator
}