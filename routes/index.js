const router = require('express').Router();
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const passport = require("passport");

router.get('/', (req, res) => {

    console.log('req session user', req.session.user);


    res.send(
        req.session.user !== undefined
            ? `Logged in as ${req.session.user.displayName || req.session.user.username}` : "Logged Out")
});

router.get('/github/callback', passport.authenticate('github', {
        failureRedirect: '/api-docs', session: false
    }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);
router.use('/api-docs', swaggerUI.serve)
router.use('/api-docs', swaggerUI.setup(swaggerDocument));
router.use('/movies', require('./movies'));
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));



module.exports = router;
