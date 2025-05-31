const pool = require('../database/db');

const clientController = {

  // Obtener todos los productos del cliente
  getAllProducts_client: async (req, res) => {
    // TODO: reimplementar
    try {
      const [rows] = await pool.query('SELECT * FROM Product');
      res.json(rows);
    } catch (error) {
      console.error('Error en <getAllProducts>:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = clientController;
