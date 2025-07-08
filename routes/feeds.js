const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // to handle multipart/form-data (image)

const { verifyToken } = require('../middleware/authMiddleware');
const feedsController = require('../controllers/feedsController');

router.post('/', verifyToken, upload.single('img_feeds'), feedsController.createFeed);
router.get('/', feedsController.getAllFeeds); 
router.get('/:id', feedsController.getFeedById);
router.put('/:id', verifyToken, feedsController.updateFeed);
router.delete('/:id', verifyToken, feedsController.deleteFeed);

module.exports = router;
