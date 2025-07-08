const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const ratingsController = require('../controllers/ratingsController');

// CREATE / UPDATE
router.post('/', verifyToken, ratingsController.setRating);

// GET Average & Count for a Feed
router.get('/:id', ratingsController.getRatingByFeed);

// GET Logged-in User's Rating for a Feed
router.get('/user/:id', verifyToken, ratingsController.getUserRating);

// DELETE Rating by User
router.delete('/:id', verifyToken, ratingsController.deleteRating);

module.exports = router;
