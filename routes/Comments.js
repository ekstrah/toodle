var express = require('express');
var router = express.Router();
var CommentController = require('../controllers/CommentController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    CommentController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    CommentController.show(req, res);
});


/*
 * PUT
 */
router.put('/:id', function (req, res) {
    CommentController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    CommentController.remove(req, res);
});

/*
 * Create with Location and ParentComment
 */
router.post('/:location_id/:parent_comment_id?', function (req, res) {
    CommentController.create(req, res);
});

/*
 * List with populated children
 */
router.get('/:id/with_children', function (req, res) {
    CommentController.listChildren(req, res);
});

module.exports = router;
