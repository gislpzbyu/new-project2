const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/movies', require('./movies'));

module.exports = router;