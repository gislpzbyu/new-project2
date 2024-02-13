const router = require('express').Router();
const auth = require('../middleware/authenticate.js');
const moviesController = require('../controllers/movies')

// router.get('/', moviesController.getAll);
router.get('/', auth.isAuthenticated, moviesController.getAll);

router.get('/:id', auth.isAuthenticated, moviesController.getSingle);

router.post('/', auth.isAuthenticated, moviesController.createMovie);

router.put('/:id', auth.isAuthenticated, moviesController.updateMovie);

router.delete('/:id', auth.isAuthenticated, moviesController.deleteMovie);

module.exports = router;
