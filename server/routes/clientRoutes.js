const express = require('express');
const router = express.Router();
//Cliente
const clientController = require('../controllers/clientController.js')
router.get('/', clientController.getAllProducts_client);
//Para cliente usar 
//
//fetch('http://localhost:5000/api/products/client');
module.exports = router;