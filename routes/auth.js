const express = require('express');
const {check, body} = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth')

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', [
    check('email').isEmail().withMessage('Please enter a valid email'), 
    body('name', 'Please enter a valid name').isAlpha().isLength({min: 1}),
    check('password').isLength({min: 5}).withMessage('Please enter a valid password')], 
authController.PostSignup);
router.post('/logout', authController.postLogout);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reset-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;