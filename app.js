const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const session = require('express-session');
const flash = require('connect-flash');

class App {
    constructor() {
        this.app = express();
        this.configureMiddleware();
        this.configureRoutes();
        this.configurePassport();
    }

    configureMiddleware() {
        db.connect();
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(bodyParser.json());
        this.app.use(session({
            secret: 's3Cur3$eSs10nK3Y',
            resave: false,
            saveUninitialized: true,
        }));
        this.app.use(flash());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    configureRoutes() {
        this.app.use('/', authRoutes);
        this.app.use('/', chatRoutes);
    }

    configurePassport() {
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
    }
}

module.exports = new App().app;