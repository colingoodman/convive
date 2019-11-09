var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');
var mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID
const mongoUtil = require( '../mongoUtil' );
const db = mongoUtil.getDb();

module.exports = function(app){

  app.post('/chat', async function(req, res) {
    const user = {
        user0: req.body.user0,
        user1: req.body.user1,
      }

    await db.collection( 'Chats' ).insertOne(chat)
    res.end()
  });

  app.get('/chat', async function(req, res) {
    res.send(await db.collection( 'Chats' ).find({ "_id": new ObjectID(req.body.chatID) }).toArray());
  });

  app.post('/message', async (req, res) => {
    const message = {
        username: req.body.username,
        message: req.body.message,
        timestamp: new Date(),
        chatID: new ObjectID(req.body.chatID),
      }

    await db.collection( 'Messages' ).insertOne(message)
    res.end()
  });

  app.get('/message', async (req, res) => {
    if (!req.user) return res.sendStatus(401)

    res.send(await db.collection( 'Messages' ).find({ chatID: new ObjectID(req.body.chatID) }).toArray());
  })


}
