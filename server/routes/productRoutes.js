const express = require('express');
const router = express.Router();

//Administrador CRUD
const productController = require('../controllers/productController');
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);

module.exports = router;

