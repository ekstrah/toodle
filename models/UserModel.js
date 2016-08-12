var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({	
  'id' : { type: String, unique: true },
  'name' : String,
  'email' : String
});

module.exports = mongoose.model('User', UserSchema);
