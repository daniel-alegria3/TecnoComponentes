const express = require('express');
const router = express.Router();
//Cliente
const clientController = require('../controllers/clientController.js')
router.get('/', clientController.getAllProducts_client);
router.post('/register', clientController.register);
router.post('/login', clientController.login);
module.exports = router;
