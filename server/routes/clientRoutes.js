const express = require('express');
const router = express.Router();
const session = require('express-session');

//Cliente
const cauth = require('../middlewares/clientAuth');
cauth.init(router)

router.post('/register', cauth.register);
router.post('/login', cauth.login);
router.get('/logged_in', cauth.isLoggedIn);
router.post('/logout', cauth.requireLogin, cauth.logout);

const clientController = require('../controllers/clientController.js')
router.get('/', cauth.requireLogin, clientController.getAllProducts_client);

module.exports = router;

