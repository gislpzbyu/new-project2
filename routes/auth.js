const router = require('express').Router();
const passport = require("passport");

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/test', (req, res) => {
    res.send({
        message: 'This is a test message'
    })
})

module.exports = router;
