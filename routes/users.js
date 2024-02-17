const router = require('express').Router();
const auth = require('../middleware/authenticate.js');
const usersController = require('../controllers/users');

router.get('/', auth.isAuthenticated, usersController.getAllUsers);

router.get('/:id', auth.isAuthenticated, usersController.getSingleUser);

router.post('/', auth.isAuthenticated, usersController.createUser);

router.put('/:id', auth.isAuthenticated, usersController.updateUser);

router.delete('/:id', auth.isAuthenticated, usersController.deleteUser);

module.exports = router;
