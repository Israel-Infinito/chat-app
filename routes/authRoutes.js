const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');

const router = express.Router();
// route to get login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.post('/login', authController.login);
router.get('/logout', authController.logout);

// route to post register
router.post('/register', authController.register);

module.exports = router;