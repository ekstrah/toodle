var LocationModel = require('../models/LocationModel.js');
var CommentModel = require('../models/CommentModel.js');

/**
 * LocationController.js
 *
 * @description :: Server-side logic for managing Locations.
 */
module.exports = {

    /**
     * LocationController.list()
     */
    list: function (req, res) {
        LocationModel.find(function (err, Locations) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Location.',
                    error: err
                });
            }
            return res.json(Locations);
        });
    },


    /**
     * LocationController.listComments()
     * return all comment posted in this location
     */
    listComments: function (req, res) {
      LocationModel.findOne({_id: req.params.id})
        .then( function (_location) {
          CommentModel.find({ location: _location }, function (err, _comments) {
            if (err) throw Error('Error while getting _comments');

            return res.json(_comments);
          });
        })
        .catch( function (err) { 
          return res.status(500).json({
            message: 'Error in LocationController.listComments()', error: err
          });
        });
    },

    /**
     * LocationController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        LocationModel.findOne({_id: id}, function (err, Location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Location.',
                    error: err
                });
            }
            if (!Location) {
                return res.status(404).json({
                    message: 'No such Location'
                });
            }
            return res.json(Location);
        });
    },

    /**
     * LocationController.create()
     */
    create: function (req, res) {
        var Location = new LocationModel({
          name : req.body.name,			
          latitude : req.body.latitude,			
          longitude : req.body.longitude
        });

        Location.save(function (err, Location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Location',
                    error: err
                });
            }
            return res.status(201).json(Location);
        });
    },

    /**
     * LocationController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        LocationModel.findOne({_id: id}, function (err, Location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Location',
                    error: err
                });
            }
            if (!Location) {
                return res.status(404).json({
                    message: 'No such Location'
                });
            }

            Location.name = req.body.name ? req.body.name : Location.name;			
            Location.latitude = req.body.latitude ? req.body.latitude : Location.latitude;			
            Location.longitude = req.body.longitude ? req.body.longitude : Location.longitude;			
            Location.save(function (err, Location) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Location.',
                        error: err
                    });
                }

                return res.json(Location);
            });
        });
    },

    /**
     * LocationController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        LocationModel.findByIdAndRemove(id, function (err, Location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Location.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
