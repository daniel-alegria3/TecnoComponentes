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
      const [rows] = await pool.query(
        `CALL login_cliente(?, ?)`,
        [mail.trim(), password]
      );
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
  }

};

module.exports = clientController;
