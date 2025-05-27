const express = require('express');
const router = express.Router();
const session = require('express-session');

/// Permite que router use express-session
router.use(session({
  name: 'my-client-cookie-name.sid',
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production with HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

/// Middleware para verificar session de usuario
function requireAuth(req, res, next) {
  if (!req.session.id_client)
    return res.status(401).json({ error: 'Cliente no ha iniciado sesion.' });
  next();
};

//Cliente
const clientController = require('../controllers/clientController.js')
router.post('/register', clientController.register);
router.post('/login', clientController.login);
router.get('/logged_in', clientController.logged_in);
router.post('/logout', clientController.logout);

router.get('/', requireAuth, clientController.getAllProducts_client);

module.exports = router;

