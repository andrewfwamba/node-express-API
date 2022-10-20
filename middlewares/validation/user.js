const {check, validationResult} = require('express-validator');

exports.validateUserSignUp = [
    check('fullname').trim()
    .not()
    .isEmpty()
    .withMessage('Name is required')
    // .not()
    .isString()
    .withMessage('Must be a valid name')
    .isLength({min: 3, max: 20})
    .withMessage('Name must between 3 and 20 characters long'),
    check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email address'),
    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password cannot be empty')
    .isLength({min:8, max: 20})
    .withMessage('Password must between 8 and 20 characters long'),
    check('confirmpassword').trim().not().isEmpty().custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('Password should match confirm password');
        } 
        return true
    })
]

exports.userValidation = (req, res, next)=>{
    const result = validationResult(req).array();
    if (!result.length) return next();
    const error = result[0].msg;
    res.json({success: false, message: error});
}

exports.validateUserSignIn = [
    check('email')
    .trim()
    .isEmail()
    .withMessage('email/password is required'),
    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('email/password is required')
]