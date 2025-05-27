const pool = require('../database/db');

const clientController = {

  // Obtener todos los productos
  getAllProducts_client: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Product');
      res.json(rows);
    } catch (error) {
      console.error('Error en <getAllProducts>:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  register: async (req, res) => {
    const { mail, password } = req.body;

    if (!mail || mail.trim() === '' || !password || password.trim() === '') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
      const [result] = await pool.query(
        `CALL agregar_cliente(?, ?)`,
        [mail.trim(), password]
      );
      const [rows] = await pool.query('SELECT * FROM Client WHERE mail = ?', [mail.trim()]);
      if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
      req.session.id_client = rows[0].id_client; // req.session provided by express-session
      res.status(201).json({ message: 'Cliente registrado correctamente'});
    } catch (error) {
      if (error?.sqlState === '45000') {
        console.error('Error en <cliente.register>:', error);
        res.status(500).json({ error: 'No se pudo crear el cliente: ' + error.sqlMessage});
      }
      else {
        console.error('Error en <cliente.register>:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  },

  login: async (req, res) => {
    const { mail, password } = req.body;

    if (!mail || mail.trim() === '' || !password || password.trim() === '') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
      await pool.query(
        `CALL login_cliente(?, ?)`,
        [mail.trim(), password]
      );
      const [rows] = await pool.query('SELECT * FROM Client WHERE mail = ?', [mail.trim()]);
      req.session.id_client = rows[0].id_client; // req.session provided by express-session
      res.status(201).json({ message: 'Login exitoso' });
    } catch (error) {
      if (error?.sqlState === '45000') {
        console.error('Error en <cliente.login>:', error);
        res.status(500).json({ error: 'Error en login: ' + error.sqlMessage});
      }
      else {
        console.error('Error en <cliente.login>:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  },

  logged_in: async (req, res) => {
    if (req.session.id_client) {
      res.json({ loggedIn: true, id_client: req.session.id_client});
    } else {
      res.json({ loggedIn: false });
    }
  },

  logout: async (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('my-client-cookie-name.sid');
      res.json({ success: true });
    });
  },
};

module.exports = clientController;
