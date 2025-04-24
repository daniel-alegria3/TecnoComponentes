const pool = require('../database/db');

const productController = {

  // Obtener todos los productos
  getAllProducts: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Product');
      res.json(rows);
    } catch (error) {
      console.error('Error en getAllProducts:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },


  // Obtener un producto por su ID
  getProductById: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Product WHERE id_product = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(rows[0]);
    } catch (error) {
      console.error('Error en getProductById:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Crear un nuevo producto
  createProduct: async (req, res) => {
    const { name, images_path, brand, description, price, stock } = req.body;

    if (!name || name.trim() === '' || isNaN(price) || price < 0 || isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO Product (name, images_path, brand, description, price, stock)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name.trim(), images_path, brand, description, price, stock]
      );
      res.status(201).json({ message: 'Producto creado correctamente', id_product: result.insertId });
    } catch (error) {
      console.error('Error en createProduct:', error);
      res.status(500).json({ error: 'No se pudo crear el producto' });
    }
  },

  // Actualizar un producto existente
  updateProduct: async (req, res) => {
    const { name, images_path, brand, description, price, stock } = req.body;

    if (!name || name.trim() === '' || isNaN(price) || price < 0 || isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
      const [result] = await pool.query(
        `UPDATE Product SET name = ?, images_path = ?, brand = ?, description = ?, price = ?, stock = ? WHERE id_product = ?`,
        [name.trim(), images_path, brand, description, Number(price), Number(stock), req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
      console.error('Error en updateProduct:', error);
      res.status(500).json({ error: 'No se pudo actualizar el producto' });
    }
  },

  // Eliminar un producto
  deleteProduct: async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM Product WHERE id_product = ?', [req.params.id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error en deleteProduct:', error);
      res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
  }
};

module.exports = productController;
