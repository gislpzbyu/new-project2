const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const cors = require("cors");
const GithubStrategy = require('passport-github').Strategy;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

app
    .use(bodyParser.json())
    .use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
        )
        res.setHeader(
            "Access-Control-Allow-Methods",
            "POST, GET, PUT, PATCH, OPTIONS, DELETE"
        );
        next();
    })
    .use(cors({methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]}))
    .use(cors({origin: "*"}))
    .use('/', require('./routes'));

passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, function (accessToken, refreshToken, profile, done) {
        // User.find({ githubId: profil;e.id), function (err, user) { Find User in The Database
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => {
    req.send(
        req.session.user !== undefined
            ? `Logged in as ${req.session.user.displayName}` : "Logged Out")
});

app.get('/github/callback', passport.authenticate('github', {
        failureRedirect: '/api-docs', session: false
    }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {

        app.listen(port, () => {
            console.log(`Running on port ${port}`)
        });
    }
});
