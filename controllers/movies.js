const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const yup = require("yup");

const movieSchema = yup.object().shape({
  title: yup.string().required("title is required"),
  genre: yup.string().required("genre is required"),
  year: yup.number().integer().positive().required("year is required"),
  director: yup.string().required("director is required"),
  rating: yup.number().min(0).max(10).required("rating is required"),
  actors: yup.array().of(yup.string()).required("actors is required"),
  plot: yup.string().required("plot is required"),
});

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection("movies").find();
    const movies = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSingle = async (req, res) => {
  try {
    const movieId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection("movies").find({ _id: movieId });
    const movies = await result.toArray();
    if (movies.length === 0) {
      res.status(404).json({ error: "Movie not found" });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(movies[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createMovie = async (req, res) => {
  try {
    await movieSchema.validate(req.body, { abortEarly: false });

    const newMovie = {
      title: req.body.title,
      genre: req.body.genre,
      year: req.body.year,
      director: req.body.director,
      rating: req.body.rating,
      actors: req.body.actors,
      plot: req.body.plot,
    };
    const response = await mongodb.getDatabase().db().collection("movies").insertOne(newMovie);

    if (response.acknowledged) {
      res.status(201).send(`${newMovie.title} Movie data was successfully inserted`);
    } else {
      res.status(500).json(response.error || "Some error occurred while creating the movie.");
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
};

const updateMovie = async (req, res) => {
  try {
    const movieId = new ObjectId(req.params.id);

    await movieSchema.validate(req.body, { abortEarly: false });

    const newMovie = {
      title: req.body.title,
      genre: req.body.genre,
      year: req.body.year,
      director: req.body.director,
      rating: req.body.rating,
      actors: req.body.actors,
      plot: req.body.plot,
    };
    const response = await mongodb.getDatabase().db().collection("movies").replaceOne({ _id: movieId }, newMovie);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || "Some error occurred while updating the movie.");
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movieId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection("movies").deleteOne({ _id: movieId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createMovie,
  getSingle,
  getAll,
  updateMovie,
  deleteMovie,
};
