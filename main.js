const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const cors = require("cors");
const GitHubStrategy = require('passport-github').Strategy;

const app = express();
const port = 3000;

app
    .use(bodyParser.json())
    .use(
        session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        })
    )
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        );
        next();
    })
    .use(cors({ methods: ["GET", "POST", "PUT", "DELETE", "UPDATE", "PATCH"] }))
    .use(cors({ origin: "*" }))
    .use('/', require('./routes'));

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        function (accessToken, refeshToken, profile, done) {
            //User.findOrCreate({githubId: profile.id}, function(err, user) {
            return done(null, profile);
            // });
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});



mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {

        app.listen(port, () => {
            console.log(`Running on port ${port}`)
        });
    }
});
