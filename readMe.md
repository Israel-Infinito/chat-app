<!-- // - app.js (or server.js)
// - package.json
// - controllers
//   - authController.js
//   - chatController.js
// - models
//   - userModel.js
//   - chatModel.js
// - routes
//   - authRoutes.js
//   - chatRoutes.js
// - public
//   - html
//     - login.html
//     - register.html
//     - chat.html
//   - js
//     - login.js
//     - register.js
//     - chat.js
//   - css
//     - style.css
// - config
//   - db.js

//   const passport = require('passport');
//   const LocalStrategy = require('passport-local').Strategy;
//   app.use(passport.initialize());
//   app.use(passport.session());

//   passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
// app.post('/login', passport.authenticate('local', { successRedirect: '/',
//                                                     failureRedirect: '/login',
//                                                     failureFlash: true }));

// VIDEO RESOURCES
// https://www.youtube.com/watch?v=O5kh3sTVSvA (LOGIN AND REGISTER)
//https://www.youtube.com/watch?v=bhiEJW5poHU (MONGODB AND MONGOOSE)
// https://www.youtube.com/watch?v=kOJEWNPYBUo (CHAT APP) -->
// https://www.youtube.com/watch?v=ACUXjXtG8J4

