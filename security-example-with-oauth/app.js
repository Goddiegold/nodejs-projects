const path = require('path')
const express = require('express');
require('dotenv').config()
const helmet = require('helmet');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const cookieSession = require('cookie-session')

const app = express();

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://localhost:3000/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        console.log('profile', profile)
        done(null, profile)
    }
));
passport.serializeUser((user, done) => {
    done(null, user.id)
});
passport.deserializeUser((id, done) => {
    done(null, id)
});

app.use(helmet());
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_SECRET_1, process.env.COOKIE_SECRET_2],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());

// middleware for handling login
function checkLoggedIn(req, res, next) {
    const isLoggedIn = req.isAuthenticated() && req.user;
    if (!isLoggedIn) return res.status(403).json({ error: 'You are not logged in' });

    next();
}

app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }))
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failure' }),
    (req, res) => res.redirect('/')
);
app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/secret', checkLoggedIn, (req, res) => res.send('Your secret is 1345'))
app.get('/failure', (req, res) => res.send('You are not logged in'));

module.exports = app;


// TODO: Handle errors
    // TypeError: req.session.regenerate is not a function
    // at SessionManager.logIn (C:\Users\OBINNA PC\Documents\NODE\Security-Example\node_modules\passport\lib\sessionmanager.js:28:15)
    // at req.login.req.logIn (C:\Users\OBINNA PC\Documents\NODE\Security-Example\node_modules\passport\lib\http\request.js:39:26)
    // at strategy.success (C:\Users\OBINNA PC\Documents\NODE\Security-Example\node_modules\passport\lib\middleware\authenticate.js:256:13)
    // at verified (C:\Users\OBINNA PC\Documents\NODE\Security-Example\node_modules\passport-oauth2\lib\strategy.js:189:20)
    // at Strategy._verify (C:\Users\OBINNA PC\Documents\NODE\Security-Example\app.js:19:9)
    // at C:\Users\OBINNA PC\Documents\NODE\Security-Example\node_modules\passport-oauth2\lib\strategy.js:205:24
    // at C:\Users\OBINNA PC\Documents\NODE\Security-Example\node_modules\passport-google-oauth20\lib\strategy.js:122:5
    // at passBackControl (C:\Users\OBINNA PC\Documents\NODE\Security-Example\node_modules\oauth\lib\oauth2.js:134:9)
    // at IncomingMessage.<anonymous> (C:\Users\OBINNA PC\Documents\NODE\Security-Example\node_modules\oauth\lib\oauth2.js:157:7)
    // at IncomingMessage.emit (node:events:525:35)