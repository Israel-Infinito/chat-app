const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const Message = require('./models/messageModel');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const session = require('express-session');
const flash = require('connect-flash');



db.connect();

// Default route to test if the server is running
app.get('/', (req, res) => {
    res.send('');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(session({
    secret: 's3Cur3$eSs10nK3Y',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRoutes);
app.use('/', chatRoutes);




// Passport authentication strategy for logging in users
passport.use(new LocalStrategy(
    async function (username, password, done) {
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        } catch (e) {
            return done(e);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = app;