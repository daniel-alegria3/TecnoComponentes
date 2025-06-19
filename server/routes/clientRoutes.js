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
router.post('/agregarcarrito', clientController.agregarCarrito);
router.get('/vercarrito/:id', clientController.verCarrito);
router.delete('/vaciarcarrito', clientController.vaciarCarrito);
router.get('/vaciarhistcompras', clientController.obtenerHistorialCompras);
router.post('/realizarcompra', clientController.realizarCompra);
router.post('/creardireccion', clientController.crearDireccionCliente);
router.get('/verdireccion/:id', clientController.verDireccionesCliente);
router.post('/editardireccion/', clientController.editarDireccionCliente);
router.delete('/eliminardireccion/', clientController.eliminarDireccionCliente);

module.exports = router;

