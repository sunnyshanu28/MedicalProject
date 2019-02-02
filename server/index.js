
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const router = express.Router();

const port = process.env.PORT || 4000;

const passport = require("passport");
const path = require("path");

const User = require('./models/users');
const config = require('./config');
const user = require('./routes/user');
const dashboard = require('./routes/dashboard');

const cors = require('cors');
const food_jokes = require('./routes/food_jokes_route');
const celebrity_jokes = require('./routes/celebrity_jokes_route');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// using morgan to log requests to the console
app.use(morgan('dev'));
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log("CORS-enabled web server correctly connected!");

});


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://glacial-river-90152.herokuapp.com/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors());

app.use('/api', dashboard);
app.use('/api/user', user);

app.use('/api/jokes', food_jokes);



app.use((req,res,next) => {
    
    const token = req.body.token || req.query.token || req.headers['access-token'];

    if(token){
        jwt.verify(token, config.secretKey, function(err, user) {
            if(err){
                res.json({err:err});
            }
            else{
                next();
            }
        });
    }
    else {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
});

app.use('/api/jokes', celebrity_jokes);



mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log("CORS-enabled web server correctly connected!");

});


app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


app.set('port', (process.env.PORT || 5000));
app.listen(port,()=> {
    console.log('Server Started on Port:' + port);
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
