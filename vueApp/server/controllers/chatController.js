var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');
var mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID
const mongoUtil = require( '../mongoUtil' );
const db = mongoUtil.getDb();
const spawn = require("child_process").spawn;

module.exports = function(app){

  app.post('/chat', async function(req, res) {
    const user = {
        user0: req.body.user0,
        user1: req.body.user1,
      }

    await db.collection( 'Chats' ).insertOne(chat)
    res.end()
  });

  app.get('/chat/:chatid', async function(req, res) {
    res.send(await db.collection( 'Chats' ).findOne({ "_id": new ObjectID(req.params.chatid) }));
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

  app.get('/chat/:chatid/messages', async (req, res) => {
    if (!req.user) return res.sendStatus(401)
    console.log(req.params)

    res.send(await db.collection( 'Messages' ).find({ "chatID": new ObjectID(req.params.chatid) }).toArray());
  })

  app.post('/score', async (req, res) => {

    //var exec = require('child_process').exec;

    //exec(`python backup2.py ${req.body.ObjId}`)
    console.log("script")
    res.end();
    })

}
