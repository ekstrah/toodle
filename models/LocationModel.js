var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LocationSchema = new Schema(
    {	
      'name' : {
        type: String,
        unique: true
      },	

      'latitude' : Number,	

      'longitude' : Number
    });

module.exports = mongoose.model('Location', LocationSchema);
