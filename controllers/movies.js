const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const {createMovieValidationSchema, updateMovieValidationSchema} = require("../utils/movies.validation");


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
        await createMovieValidationSchema.validate(req.body, { abortEarly: false });

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
            res.status(201).json({ message: `${newMovie.title} Movie data was successfully inserted` });
        } else {
            res.status(500).json({ error: response.error || "Some error occurred while creating the movie." });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
};

const updateMovie = async (req, res) => {
    try {
        const movieId = new ObjectId(req.params.id);

        const movie = await mongodb.getDatabase().db().collection("movies").findOne({ _id: movieId });

        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        await updateMovieValidationSchema.validate(req.body, { abortEarly: true });

        const response = await mongodb.getDatabase().db().collection("movies").updateOne({ _id: movieId }, { $set: req.body });

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Movie updated successfully" });
        } else {
            res.status(500).json({
                error: response.error || "To update a movie, you need to update at least one property"
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors || err.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const movieId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("movies").deleteOne({ _id: movieId });
        if (response.deletedCount > 0) {
            res.status(204).end();
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
