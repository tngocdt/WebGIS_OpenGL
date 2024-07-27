var LocalStrategy = require('../node_modules/passport-local').Strategy;
var dateFormat = require('dateformat');

// var User = require('../app/models/usermodel');

var sqlDb = require('../node_modules/mssql');
var config = require('../config/database');
var request = new sqlDb.Request([config]);
var dbcurd = require('../public/js/dbcrud');


//expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (username, done) {
        // console.log('serializing user:', username);
        done(null, username);
    });

    // used to deserialize the user
    passport.deserializeUser(function (username, done) {
        var promiseUser = dbcurd.FindUser(username);
        promiseUser.then(function (resultPass) {
            // var njsdataUser = JSON.parse(JSON.stringify(resultPass.recordset).replace(/"\s+|\s+"/g, '"'));  // using resultPass.recordset for mssql
            var njsdataUser = JSON.parse(JSON.stringify(resultPass.rows).replace(/"\s+|\s+"/g, '"'));   // using resultPass.rows for PostgreSQL
            if (njsdataUser.length > 0) {
                done(null, username);
                console.log('passport - deserializeUser:', username);
            } else {
                done(null, false, {
                    message: 'Incorrect Username!'
                });
            }
        }).catch(function (err) {
            return done(err, false);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {



            });


        }));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function (req, username, password, done) { // callback with username and password from our form
            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            // console.log("LocalStrategy");

            var promiseUser = dbcurd.FindUser(username);
            promiseUser.then(function (resultPass) {
                var njsdataUser = JSON.parse(JSON.stringify(resultPass.rows).replace(/"\s+|\s+"/g, '"'));
                if (njsdataUser.length > 0) {
                    var promisePass = dbcurd.FindCorrectUserNPassword(username, password);
                    promisePass.then(function (resultPass) {
                        var njsdataPass = JSON.parse(JSON.stringify(resultPass.rows).replace(/"\s+|\s+"/g, '"'));
                        if (njsdataPass.length > 0) {
                            req.session.username = username;
                            console.log('passport - local-login:', req.session.username);
                            return done(null, req.session.username);                            
                        } else {
                            return done(null, false, {
                                message: 'Incorrect Password!'
                            });
                        }
                    }).catch(function (err) {
                        return done(err, false, req.flash('error', err)); // req.flash is the way to set flashdata using connect-flash
                    });
                } else {
                    return done(null, false, {
                        message: 'Incorrect Username!'
                    });
                }
            }).catch(function (err) {
                return done(err, false);
            });
        }));
};