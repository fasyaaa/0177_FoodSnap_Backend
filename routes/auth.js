const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', (req, res, next) => {
    console.log("Hit /api/auth/register");
    next();
}, authController.register);
router.post('/login', (req, res) => {
    console.log("Hit /api/auth/login");
    authController.login(req, res);
});

module.exports = router;
