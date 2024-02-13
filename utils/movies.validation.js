const yup = require("yup");
const createMovieValidationSchema = yup.object().shape({
    title: yup.string().required("title is required"),
    genre: yup.string().required("genre is required"),
    year: yup.number().integer().positive().required("year is required"),
    director: yup.string().required("director is required"),
    rating: yup.number().min(0).max(10).required("rating is required"),
    actors: yup.array().of(yup.string()).required("actors is required"),
    plot: yup.string().required("plot is required"),
});

const updateMovieValidationSchema = yup.object().shape({
    title: yup.string().min(1),
    genre: yup.string().min(1),
    year: yup.number().integer().positive().min(1),
    director: yup.string().min(1),
    rating: yup.number().min(0).max(10),
    actors: yup.array().of(yup.string()),
    plot: yup.string().length(1),
});

module.exports = {
    createMovieValidationSchema,
    updateMovieValidationSchema
}
