const MongoClient = require( 'mongodb' ).MongoClient;
const url = 'mongodb+srv://johnchapple:hack19password@cluster0-dwemy.mongodb.net/test?retryWrites=true&w=majority';

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db('Cluster0');
      return callback( err );
    } );
  },

  getDb() {
    return _db;
  }
}
