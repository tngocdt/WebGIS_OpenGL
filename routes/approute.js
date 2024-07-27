var express = require('../node_modules/express');
const router = express.Router();

// const Ninja = require('../models/ninja');
var passport = require('../node_modules/passport');
var appcontroller = require('../app/controllers/appcontroller');

router.get('/login', appcontroller.login);
router.get('/signup', appcontroller.signup);

router.get('/', appcontroller.loggedIn, appcontroller.home); //home
router.get('/home', appcontroller.loggedIn, appcontroller.home); //home

router.get('/', appcontroller.home); //home
router.get('/home', appcontroller.home); //home
// router.get('/openui5/openui5index', appcontroller.openui5index);

router.post('/', appcontroller.homePost); //home
router.post('/home',appcontroller.homePost);//home

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash messages
    session: false, // must add this row in passport@0.7.0 (no need this row in < passport@0.6.0)
}));

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash messages
    session: false,
}));

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        req.logout();
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});



module.exports = router;