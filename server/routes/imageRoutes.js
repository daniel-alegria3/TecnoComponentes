const express = require('express');
const router = express.Router();
const productController = require('../controllers/imageController');

router.get('/', productController.getAllImages);
router.post('/', productController.createImage);
router.delete('/:id', productController.deleteImage);
router.get('/:id', productController.getImageById);
// router.put('/:id', productController.updateImage);

module.exports = router;
