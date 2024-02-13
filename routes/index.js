const router = require('express').Router();
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.get('/', (req, res) => { res.send('Hello World!'); });
router.use('/api-docs', swaggerUI.serve)
router.use('/api-docs', swaggerUI.setup(swaggerDocument));
router.use('/movies', require('./movies'));
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
//calling the swagger routes here swagger don't generate the routes api-docs


module.exports = router;
