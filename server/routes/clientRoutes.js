const express = require('express');
const router = express.Router();
//Cliente
const clientController = require('../controllers/clientController.js')
router.get('/', clientController.getAllProducts_client);
// necesita: mail, password_encrypted
router.post('/register', clientController.register);
// necesita: mail, password_encrypted
router.post('/login', clientController.login);
module.exports = router;