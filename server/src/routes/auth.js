// src/routes/auth.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/signout', AuthController.signout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-email', AuthController.verifyEmail);

module.exports = router;
