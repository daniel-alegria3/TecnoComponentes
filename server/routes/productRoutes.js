const express = require('express');
const router = express.Router();

//Administrador CRUD
const productController = require('../controllers/productController');
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);

//Cliente
const clientController = require('../controllers/clientController.js')
router.get('/client', clientController.getAllProducts_client);
//Para cliente usar 
//
//fetch('http://localhost:5000/api/products/client');


module.exports = router;
