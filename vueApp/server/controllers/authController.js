var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');
var mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID
const mongoUtil = require( '../mongoUtil' );
const db = mongoUtil.getDb();
const jwt = require('jsonwebtoken');
const config = require('../config');
const coin = require('../../client/src/coin')

function createToken(user) {
  return jwt.sign({
    user: { id: user._id, username: user.username }
  }, config.secret);
}

module.exports = function(app){

  app.post('/register', async function(req, res) {
    const user = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 9),
      joined: new Date(),
      previousLogin: new Date(),
      type: 'user',
      settings: {
        points: 0,
        colorHex: '#647C64',
        taskBox: {
          showDeleteButton: false,
          showDeactivated: false,
        },
      }
    }

    await db.collection( 'Users' ).insertOne(user)
    res.send({ token: createToken(user) })
  });

  app.post('/login', async (req, res) => {
    const user = await db.collection( 'Users' ).findOne(
      { 'username' : req.body.username, 'password' : req.body.password }
    )

    var exec = require('child_process').exec;

    exec('python account_gen.py')

    if (!user) return res.status(404).send('No user found.');

    /*
    if (user.WID == null) {
      coin.createWid(user.username, user.password).then(response => {
        user.WID = response.id
        coin.createAid(response.id, user.username, user.password).then(response => {
          user.AID = response.id
        })
      })
    }
    */

    res.send({ token: createToken(user) });
  });

  app.get('/user/:id', async (req, res) => {
    const user = await db.collection( 'Users' ).findOne(
      { 'username' : req.params.id }
    )
    delete user.password
    res.send(user)
  })


}
