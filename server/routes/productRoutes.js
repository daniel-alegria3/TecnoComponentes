const express = require('express');
const router = express.Router();

//Administrador CRUD
const productController = require('../controllers/productController');
router.get('/allproducts', productController.getAllProducts);
router.get('/allcategory', productController.getAllCategory);
router.get('/categorybyidprod/:id', productController.getCategoryByProductId);
router.post('/insertspecs/:id', productController.updateProductSpecs);
router.post('/', productController.createProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);

module.exports = router;

