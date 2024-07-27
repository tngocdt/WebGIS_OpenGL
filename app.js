import express from 'express';
import cors from 'cors';
import global from 'jquery';
import dt from 'datatables.net';

import path from 'node:path';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import passport from 'passport';
import passportConfig from './config/passport.js';
import flash from 'connect-flash';

import appRoute from './routes/approute.js';
import apiRoute from './routes/apiroute.js';

// const mongoose = require('mongoose');
import * as configDB from'./config/database.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);

var app = express();
app.use(cors());

// global.$ = global.jQuery;

// use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
bodyParser.Promise = global.Promise;

app.use(cookieParser());
app.use(session({
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true
}));

// mongoose.set('useCreateIndex', true);
//// connect to mongodb
// mongoose.connect(configDB.cnnMongooseDB.cnnDB, { useNewUrlParser: true });
// mongoose.Promise = global.Promise;

passportConfig(passport); // pass passport for configuration

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
app.use('/', appRoute);
apiRoute(app);
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

export default app;