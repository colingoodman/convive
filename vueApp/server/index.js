//app.use(express.static('/css',express.static(__dirname + '/css')))
var express = require('express'); //server framework for node.js
var app = express(); //where we were all express functions, I think
var router = express.Router();

var mongoose = require('mongoose'); //for our mongoose database
var mongo = require('mongodb'); //dont know the difference here
//const MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var morgan = require('morgan');
var moment = require('moment');
var bodyParser = require('body-parser'); //so we can get information from req.body
var urlencodedParser = bodyParser.urlencoded({ extended: false });// same for above
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config');



var cors = require('cors');
app.use(morgan('dev'))
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var mongoUtil = require( './mongoUtil' );

mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here

  var taskController = require('./controllers/taskController');
  taskController(app);
} );

module.exports = app;

const port = process.env.PORT || 4000

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function(req, res, next) {
    try {
      const token = req.get('Authorization')
      const payload = jwt.verify(token, config.secret)
      const user = payload.user
      req.user = user
    } catch {}

    next();
});

app.listen(port, () => {
  console.log('App listening on port ' + port)
  //console.log(db);
}) // Listen on port defined in config file
