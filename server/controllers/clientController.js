const pool = require('../database/db');

const clientController = {

  // Obtener todos los productos
  getAllProducts_client: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Product');
      res.json(rows);
    } catch (error) {
      console.error('Error en getAllProducts:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = clientController;
