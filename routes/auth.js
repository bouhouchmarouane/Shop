const express = require('express');
const {check} = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth')

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', check('email').isEmail().withMessage('Please enter a valid email'), check('name').isAlpha().withMessage('Please enter a valid name'), authController.PostSignup);
router.post('/logout', authController.postLogout);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reset-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;