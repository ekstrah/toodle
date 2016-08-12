var mongoose = require('mongoose');

var Schema   = mongoose.Schema;

var CommentSchema = new Schema(
    {
      'is_root' : {
        type: Boolean,
        required: [true, 'Comment.is_root field is not specified']
      },

      'content' : {
        type: String,
        required: [true, 'Comment.content field is not specified']
      },

      'location' : {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: [true, 'Comment.location is not specified']
      },

      'parent_comment' : {	
        type: Schema.Types.ObjectId,
        ref: 'Comment'	
      },

      'children' : [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        unique: true
      }],

      'index_x' : {
        type: Number,
        required: [true, 'Comment.index_x is not specified'],
        validate: {
          validator: function (v) { return 0 <= v && v < 6; },
          message: '{VALUE} is not valid value for index_x'
        }
      },

      'index_y' : {
        type: Number,
        required: [true, 'Comment.index_y is not specified'],
        validate: {
          validator: function (v) { return 0 <= v && v < 6; },
          message: '{VALUE} is not valid value for index_y'
        }
      },

      'author_name': {
        type: String,
        required: [true, 'Comment.author_name is not specified']
      },

      'created_at' : {
        type: Date,
        default: Date.now
      }
    });

// http://frontendcollisionblog.com/mongodb/2016/01/24/mongoose-populate.html
var autoPopulateChildren = function (next) {
  this.populate('children');
  next();
};

CommentSchema
  .pre('find', autoPopulateChildren);

module.exports = mongoose.model('Comment', CommentSchema);
