const pool = require('../database/db');

const clientController = {
  getAllProducts_client: async (req, res) => {
    try {
      const [result] = await pool.query('CALL ObtenerProductosActivos()');
      
      // CALL devuelve un array de arrays, el primero contiene los resultados
      const products = result[0];
  
      const productsWithParsedSpecs = products.map(product => {
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
  
        return {
          ...product,
          specs: specsParsed
        };
      });
  
      res.json(productsWithParsedSpecs);
    } catch (error) {
      console.error('Error en <getAllProducts_client>:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
  llenarCarrito: async (req, res) => {
    const { id_client, id_product } = req.body;
  
    try {
      if (!id_client || !id_product) {
        return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
      }
  
      await pool.query('CALL llenar_carrito(?, ?)', [id_client, id_product]);
  
      res.status(200).json({ message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
      console.error('Error en llenarCarrito:', error);
      res.status(500).json({ error: error.sqlMessage || 'Error al agregar producto al carrito.' });
    }
  },
  verCarrito: async (req, res) => {
    const clientId = req.params.id;
  
    try {
      const [rows] = await pool.query('CALL ver_carrito(?)', [clientId]);
  
      // CALL devuelve un array de arrays, por eso accedemos a rows[0]
      res.json(rows[0]);
    } catch (error) {
      console.error('Error en verCarrito:', error);
      res.status(500).json({ error: 'Error al consultar el carrito.' });
    }
  },
  vaciarCarrito: async (req, res) => {
    const { id_client, id_product } = req.body;
    console.log(req.body)
    try {
      if (!id_client || !id_product) {
        return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
      }
      await pool.query('CALL vaciar_carrito(?, ?)', [id_client, id_product]);
      res.status(200).json({ message: 'Producto eliminado del carrito correctamente.' });
    } catch (error) {
      console.error('Error en vaciarCarrito:', error);
      res.status(500).json({ error: error.message || 'Error al eliminar el producto del carrito.' });
    }
  },

  realizarCompra: async (req, res) => {
    const { id_client, productos } = req.body;
  
    if (!id_client || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
  
    const connection = await pool.getConnection();
  
    try {
      await connection.beginTransaction();
  
      // Crear orden y obtener su ID
      const [ordenResult] = await connection.query('CALL crear_orden()');
      const id_order_detail = ordenResult[0][0].id;
  
      // Insertar productos usando id_client
      for (const prod of productos) {
        const { id_product, quantity } = prod;
  
        if (!id_product || !quantity || quantity <= 0) {
          throw new Error(`Producto inválido: ${JSON.stringify(prod)}`);
        }
  
        await connection.query(
          'CALL agregar_producto_orden(?, ?, ?, ?)',
          [id_order_detail, id_client, id_product, quantity]
        );
      }
  
      await connection.commit();
      res.json({ message: 'Compra realizada exitosamente', id_order_detail });
  
    } catch (error) {
      await connection.rollback();
      console.error('Error en realizarCompra:', error);
      res.status(500).json({ error: error.message });
    } finally {
      connection.release();
    }
  }
  
  
};

module.exports = clientController;
