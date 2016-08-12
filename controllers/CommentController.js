var CommentModel = require('../models/CommentModel.js');
var LocationModel = require('../models/LocationModel.js');

var Q = require('q');
var async = require('async');

var zmq = require('zmq');

var config = require('../config/config.js');

var mongoose = require('mongoose');
mongoose.Promise = Q.Promise;

/**
 * CommentController.js
 *
 * @description :: Server-side logic for managing Comments.
 */
module.exports = {

    /**
     * CommentController.list()
     */
    list: function (req, res) {
        CommentModel.find(function (err, Comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Comment.',
                    error: err
                });
            }
            return res.json(Comments);
        });
    },

    /**
     * CommentController.listChildren()
     */
    listChildren: function (req, res) {
        CommentModel.findOne({_id: req.params.id})
          .populate({
            path: 'children' ,
            model: 'Comment'
          })
          .then( function (Comment) {
            return res.json(Comment);
          })
          .catch( function (err) {
            return res.status(500).json({
              message: 'Error when getting Comment with children',
              error: err
            });
          })
    },

    /**
     * CommentController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        CommentModel.findOne({_id: id}, function (err, Comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Comment.',
                    error: err
                });
            }
            if (!Comment) {
                return res.status(404).json({
                    message: 'No such Comment'
                });
            }
            return res.json(Comment);
        });
    },

    /**
     * CommentController.create() : '/:location_id/:parent_comment_id?'
     */
    create: function (req, res) {
        // promise version
        var 
          is_root = req.body.is_root,
          content = req.body.content,
          index_x = req.body.index_x,
          index_y = req.body.index_y,
          author_name = req.body.author_name,

          parent = null;

          LocationModel.findOne({ _id : req.params.location_id }).exec()
            .then(function(_location) {
              if(req.params.parent_comment_id)
                return CommentModel.findOne({ _id : req.params.parent_comment_id }).exec()
                  .then(function(_parent) {
                    return {_location : _location, _parent: _parent};
                  });
              else 
                return {_location : _location};
            })
            .then(function( {_location, _parent }) { // Parameter Decomposition 
              var Comment = new CommentModel({
                is_root: is_root,
                content: content,
                location: _location,
                parent_comment: _parent,

                author_name: author_name,
                index_x: index_x,
                index_y: index_y
              });

              parent = _parent; // 외부 scope로 내보내자. 다음번에 써먹을 수 있도록! :: Promise 를 사용해서 가능

              return Comment.save();
            })
            .then(function (Comment) {
              request_tts(Comment._id, Comment.content);

              if(parent) {
                parent.children.push(Comment);
                parent.save();
              }

              return res.status(200).json(Comment);
            })
            .catch(function (error) {
              return res.status(500).json({
                message: 'Error when creating Comment',
                error: error
              });
            })



              /*
        LocationModel.findOne({_id: req.params.location_id}, function (err, _location) {
          if (!req.params.parent_comment_id) {
            var Comment = new CommentModel({
              is_root: req.body.is_root,
              content: req.body.content,
              location: _location,

              author_name: req.body.author_name, // TODO: check req.user is valid

              index_x: req.body.index_x,
              index_y: req.body.index_y,
            });

            Comment.save(function (err, Comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating Comment',
                        error: err
                    });
                }

                request_tts(Comment._id, Comment.content);

                return res.status(201).json(Comment);
            });
          } else {
            CommentModel.findOne({_id: req.params.parent_comment_id}, function (err, _parent) {
              var Comment = new CommentModel({
                is_root: req.body.is_root,
                content: req.body.content,
                location: _location,
                parent_comment: _parent,
                
                author_name: req.body.author_name,

                index_x: req.body.index_x,
                index_y: req.body.index_y,
              });

              Comment.save(function (err, Comment) {
                  if (err) {
                      return res.status(500).json({
                          message: 'Error when creating Comment',
                          error: err
                      });
                  }

                  request_tts(Comment._id, Comment.content);
                  
                  _parent.children.push(Comment);
                  _parent.save();
                  return res.status(201).json(Comment);
              });
            });
          }
        });

        */
    },

    /**
     * TODO: CommentModel is changed: 'created_at', 'children' is added
     * CommentController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        CommentModel.findOne({_id: id}, function (err, Comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Comment',
                    error: err
                });
            }
            if (!Comment) {
                return res.status(404).json({
                    message: 'No such Comment'
                });
            }

            Comment.is_root = req.body.is_root ? req.body.is_root : Comment.is_root;			
            Comment.content = req.body.content ? req.body.content : Comment.content;			
            Comment.location = req.body.location ? req.body.location : Comment.location;			
            Comment.parent_comment = req.body.parent_comment ? req.body.parent_comment : Comment.parent_comment;			
            Comment.author_name = req.body.author_name ? req.body.author_name : Comment.author_name;
            Comment.index_x= req.body.index_x? req.body.index_x: Comment.index_x;
            Comment.index_y= req.body.index_y? req.body.index_y: Comment.index_y;

            Comment.save(function (err, Comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Comment.',
                        error: err
                    });
                }

                return res.json(Comment);
            });
        });
    },

    /**
     * CommentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        CommentModel.findByIdAndRemove(id, function (err, Comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Comment.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

};

function request_tts (_id, text) {
  // TSS
  var REQ = zmq.socket('req');

  REQ.connect(config.routerIPC);

  REQ.send(JSON.stringify({
    comment_id: _id,
    text: text 
  }));

  REQ.on('close', function() {
    REQ.close();
  });
}
