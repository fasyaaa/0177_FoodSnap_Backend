const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const clientController = require('../controllers/clientController');

// All routes require admin role
router.use(verifyToken, verifyRole('admin'));

router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', upload.single('img_profile'), clientController.createClient);
router.put('/:id', upload.single('img_profile'), clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
