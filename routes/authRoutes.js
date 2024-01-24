const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.configureRoutes();
    }

    configureRoutes() {
        this.router.get('/login', this.getLoginPage);
        this.router.post('/login', authController.login);
        this.router.get('/logout', authController.logout);
        this.router.post('/register', authController.register);
    }

    getLoginPage(req, res) {
        res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
    }
}

module.exports = new AuthRoutes().router;