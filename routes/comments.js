const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const commentsController = require('../controllers/commentsController');

// CREATE comment / reply
router.post('/', verifyToken, commentsController.createComment);

// READ comments by feed (nested replies)
router.get('/:id', commentsController.getCommentsByFeed);

// UPDATE comment
router.put('/:id', verifyToken, commentsController.updateComment);

// DELETE comment
router.delete('/:id', verifyToken, commentsController.deleteComment);

module.exports = router;
