const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); 

class AuthController {
  // User login implementation
  static login(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { 
        return res.status(500).json({ message: 'An error occurred during authentication.' }); 
      }
      if (!user) { 
        return res.status(401).json({ message: 'Invalid username or password' }); 
      }
      req.logIn(user, function(err) {
        if (err) { 
          return res.status(500).json({ message: 'An error occurred during login.' }); 
        }
        return res.status(200).json({ status: 'success', user: req.user.username });
      });
    })(req, res, next);
  }

  // Logout implementation
  static logout(req, res) {
    req.logout();
    res.redirect('/login');
  }

  // User registration implementation
  static async register(req, res) {
    try {
      const existingUser = await User.findOne({ username: req.body.username });

      if (existingUser) {
        return res.status(400).json({ status: 'error', message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({ username: req.body.username, password: hashedPassword });
      res.status(201).json({ status: 'success' , user: user.username});
    } catch (error) {
      console.error(error)
      res.status(500).json({ status: 'error', message: 'Failed to create user' });
    }
  }
}

module.exports = AuthController;
