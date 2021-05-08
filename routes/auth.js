const express = require('express');
const {check, body} = require('express-validator/check');

const User = require('../models/user');

const router = express.Router();

const authController = require('../controllers/auth')

router.get('/login', authController.getLogin);
router.post('/login', [
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password').isLength({min: 5}).withMessage('Please enter a valid password')
], authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', [
    check('email').isEmail().withMessage('Please enter a valid email').custom((value, {req}) => {
        return User.findOne({email: value})
        .then(user => {
            if(user) {
                return Promise.reject('This email has been already used');
            }
        })
    }), 
    body('name', 'Please enter a valid name').isAlpha().isLength({min: 1}),
    check('password').isLength({min: 5}).withMessage('Please enter a valid password')
], authController.PostSignup);

router.post('/logout', authController.postLogout);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reset-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;