var express = require('./node_modules/express');
var cors = require('./node_modules/cors');

var app = express();
app.use(cors());

global.jQuery = require('./node_modules/jquery');
global.$ = global.jQuery;
var dt = require('./node_modules/datatables.net');

var path = require('node:path');
var session = require('./node_modules/express-session');
var bodyParser = require('./node_modules/body-parser');
// use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
bodyParser.Promise = global.Promise;

var cookieParser = require('./node_modules/cookie-parser');
app.use(cookieParser());
app.use(session({
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true
}));

var passport = require('./node_modules/passport');
var flash = require('./node_modules/connect-flash');

// const mongoose = require('mongoose');
// mongoose.set('useCreateIndex', true);
var configDB = require('./config/database.js');
//// connect to mongodb
// mongoose.connect(configDB.cnnMongooseDB.cnnDB, { useNewUrlParser: true });
// mongoose.Promise = global.Promise;

require('./config/passport')(passport); // pass passport for configuration

// static files;
app.use(express.static('public'));
// app.use(express.static('node_modules'));
// app.use(express.static('./public'));
// app.use(express.static(__dirname + 'public'));

// https://stackoverflow.com/questions/27464168/how-to-include-scripts-located-inside-the-node-modules-folder
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));

// setup the template engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// ****************************************************************************************************
// ****************************************************************************************************
// initialize routes
app.use('/', require('./routes/approute'));
require('./routes/apiroute')(app);
// require('./routes/iotroute.js')(app);


// error handling middleware
app.use(function (err, req, res, next) {
    console.log(err); // to see properties of message in our console
    // res.status(422).send({error: err.message});
    res.status(404).render('404', {
        title: "Sorry, page not found",
        session: req.sessionbo
    });
});

// ****************************************************************************************************
// ****************************************************************************************************

// listen to port
var server = app.listen(1024, function () {
    console.log('You are connected to server port 1024!');
});

// function taskEventFunction() {
//     var json = {
//         test: 'testeps',
//         esp8266: 12,
//         soPi: 3.14
//     };
//     io.sockets.emit('taskEvent', json);
// }

// Socket setup
/* var socket = require('socket.io');
var io = socket(server);
io.on('connection',function(socket){
    console.log('New Web Socket.IO connection is established ...!!!',socket.id);
    
    
   
}); */

exports = module.exports = app;