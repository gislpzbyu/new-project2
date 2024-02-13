const express = require('express');
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const yup = require("yup");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const movieSchema = yup.object().shape({
  title: yup.string().required("title is required"),
  genre: yup.string().required("genre is required"),
  year: yup.number().integer().positive().required("year is required"),
  director: yup.string().required("director is required"),
  rating: yup.number().min(0).max(10).required("rating is required"),
  actors: yup.array().of(yup.string()).required("actors is required"),
  plot: yup.string().required("plot is required"),
});

const app = express();

// Initialize Passport and session
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: 'your-google-client-id',
      clientSecret: 'your-google-client-secret',
      callbackURL: 'http://localhost:3000/auth/google/callback', // Adjust the callback URL as per your setup
    },
    (accessToken, refreshToken, profile, done) => {
      // Use profile information to find or create a user in your system
      // In this example, we simply use the profile as our user object
      return done(null, profile);
    }
  )
);

// ... (your existing imports and middleware)

// Your existing routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes for OAuth authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect or respond as needed
    res.redirect('/');
  }
);

// Your existing routes
const getAll = async (req, res) => {
  // ... (your existing code)
};

const getSingle = async (req, res) => {
  // ... (your existing code)
};

const createMovie = async (req, res) => {
  try {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      // Get user information from req.user and associate it with the movie
      const user = req.user;

      await movieSchema.validate(req.body, { abortEarly: false });

      const newMovie = {
        title: req.body.title,
        genre: req.body.genre,
        year: req.body.year,
        director: req.body.director,
        rating: req.body.rating,
        actors: req.body.actors,
        plot: req.body.plot,
        createdBy: user.id, // Associate the movie with the user
      };

      const response = await mongodb.getDatabase().db().collection("movies").insertOne(newMovie);

      if (response.acknowledged) {
        res.status(201).send(`${newMovie.title} Movie data was successfully inserted`);
      } else {
        res.status(500).json(response.error || "Some error occurred while creating the movie.");
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
};

// ... (your existing routes)

// Modify your existing routes to include authentication checks and user information as needed

// ... (your existing routes)

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
