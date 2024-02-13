const router = require('express').Router();

const usersController = require('../controllers/users');

router.get('/', usersController.getAll);

module.exports = router;
