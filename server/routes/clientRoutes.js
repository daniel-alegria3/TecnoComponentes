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
router.post('/agregarcarrito', cauth.requireLogin, clientController.agregarCarrito);
router.get('/vercarrito/:id', cauth.requireLogin, clientController.verCarrito);
router.delete('/vaciarcarrito', cauth.requireLogin, clientController.vaciarCarrito);
router.post('/realizarcompra', cauth.requireLogin, clientController.realizarCompra);
router.get('/vercompras', cauth.requireLogin, clientController.verCompras);
router.post('/creardireccion', cauth.requireLogin, clientController.crearDireccionCliente);
router.get('/verdireccion/', cauth.requireLogin, clientController.verDireccionesCliente);
router.post('/editardireccion/', cauth.requireLogin, clientController.editarDireccionCliente);
router.delete('/eliminardireccion/', cauth.requireLogin, clientController.eliminarDireccionCliente);

// Mover a otro archivo solo para el admin?
router.get('/vercomprastodo', async (req, res) => {
    const pool = require('../database/db');
    const connection = await pool.getConnection();

    try {
        const [result] = await pool.query('CALL obtener_historial_compras()');

        const products = result[0];

        const productsWithParsed = products.map(product => {
            let specsParsed = null;
            if (product.specs !== null) {
                try {
                    const specsString = product.specs.toString('utf-8');
                    specsParsed = JSON.parse(specsString);
                } catch (error) {
                    console.warn(`Specs inválido para el producto ID ${product.id_product}:`, error.message);
                    specsParsed = null;
                }
            }

            let images_path_parsed = [];
            if (product.images_path !== null) {
                try {
                    images_path_parsed = product.images_path.split(',');
                } catch (error) {
                    console.warn(`Images path inválido para el producto ID ${product.id_product}:`, error.message);
                    images_path_parsed = null;
                }
            }

            return {
                ...product,
                images_path: images_path_parsed,
                specs: specsParsed
            };
        });

        res.json(Array.isArray(productsWithParsed) ? productsWithParsed : []);
    } catch (error) {
        await connection.rollback();
        console.error('Error en verCompras:', error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

module.exports = router;

