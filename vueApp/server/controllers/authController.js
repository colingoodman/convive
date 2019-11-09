var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');
var mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID
const mongoUtil = require( '../mongoUtil' );
const db = mongoUtil.getDb();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

function createToken(user) {
  return jwt.sign({
    user: { id: user._id }
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
      { 'username' : req.body.username }
    )

    if (!user) return res.status(404).send('No user found.');
    const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordIsValid) return res.sendStatus(401);

    res.send({ token: createToken(user) });
  });


}
