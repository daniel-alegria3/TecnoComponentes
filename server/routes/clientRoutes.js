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
router.get('/getproducts', clientController.getAllProducts_client);
router.post('/llenarcarrito', clientController.llenarCarrito);
router.get('/vercarrito/:id', clientController.verCarrito);
router.delete('/vaciarcarrito', clientController.vaciarCarrito);
router.post('/realizarcompra', clientController.realizarCompra);

module.exports = router;

