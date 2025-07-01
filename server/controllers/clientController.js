const pool = require('../database/db');

const clientController = {
  getAllProducts_client: async (req, res) => {
    try {
      const [result] = await pool.query('CALL ObtenerProductosActivos()');

      // CALL devuelve un array de arrays, el primero contiene los resultados
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
      console.error('Error en <getAllProducts_client>:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
  agregarCarrito: async (req, res) => {
    const { id_product, quantity } = req.body;

    const id_client = req.session.id_client; // from using 'clientAuth' on the router

    try {
      if (!id_client || !id_product || !quantity || isNaN(quantity) || parseInt(quantity) < 0) {
        return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
      }

      await pool.query('CALL agregar_carrito(?, ?, ?)', [id_client, id_product, parseInt(quantity)]);

      res.status(200).json({ message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
      console.error('Error en llenarCarrito:', error);
      res.status(500).json({ error: error.sqlMessage || 'Error al agregar producto al carrito.' });
    }
  },
  verCarrito: async (req, res) => {
    let clientId = req.params.id;

    if (req.session?.id_client) {
      clientId = req.session.id_client; // from using 'clientAuth' on the router
    }

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
    const { id_product } = req.body;

    const id_client = req.session.id_client; // from using 'clientAuth' on the router

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
    const { productos } = req.body;

    const id_client = req.session.id_client; // from using 'clientAuth' on the router

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
  },

  obtenerHistorialCompras: async (req, res) => {
    const { id_client } = req.params;

    try {
        // Validación del parámetro
        if (!id_client || isNaN(id_client)) {
            return res.status(400).json({
                success: false,
                error: 'Se requiere un ID de cliente válido'
            });
        }

        const clientId = parseInt(id_client);

        // Llamar al procedimiento almacenado
        const [historial] = await pool.query(
            'CALL obtener_historial_compras_cliente(?)',
            [clientId]
        );

        // Manejar formato de respuesta
        const resultado = Array.isArray(historial[0]) ? historial[0] : historial;

        if (!resultado || resultado.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'El cliente no tiene historial de compras',
                data: [],
                count: 0
            });
        }

        res.status(200).json({
            success: true,
            data: resultado,
            count: resultado.length
        });

    } catch (error) {
        console.error('Error al obtener historial:', error);

        const statusCode = error.sqlMessage?.includes('no existe') ? 404 : 500;
        const errorMessage = error.sqlMessage || 'Error al consultar el historial';

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            ...(process.env.NODE_ENV === 'development' && {
                details: {
                    message: error.message,
                    stack: error.stack
                }
            })
        });
     }
  },

  crearDireccionCliente: async (req, res) => {
    const { id_client, city, country, physical_address } = req.body;

    try {
      // Validar parámetros obligatorios
      if (!id_client || !city || !country || !physical_address) {
        return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
      }

      // Llamar al procedimiento almacenado
      await pool.query('CALL crear_direccion_cliente(?, ?, ?, ?)', [
        id_client,
        city,
        country,
        physical_address
      ]);

      res.status(200).json({ message: 'Dirección creada correctamente.' });
    } catch (error) {
      console.error('Error en crearDireccionCliente:', error);

      // Manejar errores específicos de MySQL/MariaDB
      const errorMessage = error.sqlMessage || 'Error al crear la dirección del cliente.';
      res.status(500).json({
        error: errorMessage,
        details: error.sql ? error.sql : undefined
      });
    }
  },

  verDireccionesCliente: async (req, res) => {
    const id_client = req.params.id;

    console.log(req.params.id)
    console.log(id_client)
    try {
        // Validar parámetro obligatorio
        if (!id_client || isNaN(id_client)) {
            return res.status(400).json({
                success: false,
                error: 'El ID del cliente es obligatorio y debe ser numérico.'
            });
        }

        // Convertir a número (por si viene como string)
        const clientId = parseInt(id_client);

        // Llamar al procedimiento almacenado
        const [direcciones] = await pool.query('CALL ver_direcciones_cliente(?)', [clientId]);

        // Manejar diferentes formatos de respuesta de drivers de BD
        const resultado = Array.isArray(direcciones[0]) ? direcciones[0] : direcciones;

        if (resultado.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'El cliente existe pero no tiene direcciones registradas.',
                data: [],
                count: 0
            });
        }

        res.status(200).json({
            success: true,
            data: resultado,
            count: resultado.length
        });

    } catch (error) {
        console.error('Error en obtenerDireccionesCliente:', error);

        // Manejar errores específicos
        let statusCode = 500;
        let errorMessage = 'Error al obtener las direcciones del cliente.';

        if (error.sqlMessage && error.sqlMessage.includes('no existe')) {
            statusCode = 404;
            errorMessage = error.sqlMessage;
        }

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? {
                sqlMessage: error.sqlMessage,
                sql: error.sql
            } : undefined
        });
      }
    },

    editarDireccionCliente: async (req, res) => {
      const { id_client, id_address, city, country, physical_address } = req.body;

      try {
          // Validar parámetros obligatorios
          if (!id_client || isNaN(id_client) || !id_address || isNaN(id_address)) {
              return res.status(400).json({
                  success: false,
                  error: 'Se requieren IDs válidos de cliente y dirección.'
              });
          }

          // Validar campos de dirección
          if (!city || !country || !physical_address) {
              return res.status(400).json({
                  success: false,
                  error: 'Todos los campos (ciudad, país, dirección física) son obligatorios.'
              });
          }

          // Convertir a números
          const clientId = parseInt(id_client);
          const addressId = parseInt(id_address);

          // Llamar al procedimiento almacenado
          await pool.query(
              'CALL editar_direccion_cliente(?, ?, ?, ?, ?)',
              [clientId, addressId, city, country, physical_address]
          );

          // Respuesta exitosa
          res.status(200).json({
              success: true,
              message: 'Dirección actualizada exitosamente',
              updatedData: {
                  id_client: clientId,
                  id_address: addressId,
                  city,
                  country,
                  physical_address
              }
          });

      } catch (error) {
          console.error('Error al editar dirección:', error);

          let statusCode = 500;
          let errorMessage = 'Error al procesar la solicitud';

          if (error.sqlMessage) {
              if (error.sqlMessage.includes('no existe')) {
                  statusCode = 404;
                  errorMessage = error.sqlMessage;
              } else if (error.sqlMessage.includes('no puede estar vac')) {
                  statusCode = 400;
                  errorMessage = error.sqlMessage;
              } else if (error.sqlMessage.includes('no pertenece')) {
                  statusCode = 403;
                  errorMessage = 'La dirección no pertenece al cliente especificado';
              }
          }

          res.status(statusCode).json({
              success: false,
              error: errorMessage,
              ...(process.env.NODE_ENV === 'development' && {
                  details: {
                      sqlMessage: error.sqlMessage,
                      stack: error.stack
                  }
              })
          });
        }
    },

    eliminarDireccionCliente: async (req, res) => {
      const { id_client, id_address } = req.body;

      try {
          // Validar parámetros obligatorios
          if (!id_client || isNaN(id_client) || !id_address || isNaN(id_address)) {
              return res.status(400).json({
                  success: false,
                  error: 'Se requieren IDs válidos de cliente y dirección.'
              });
          }

          // Convertir a números
          const clientId = parseInt(id_client);
          const addressId = parseInt(id_address);

          // Llamar al procedimiento almacenado
          await pool.query(
              'CALL eliminar_direccion_cliente(?, ?)',
              [clientId, addressId]
          );

          // Respuesta exitosa
          res.status(200).json({
              success: true,
              message: 'Dirección eliminada exitosamente',
              deletedData: {
                  id_client: clientId,
                  id_address: addressId
              }
          });

      } catch (error) {
          console.error('Error al eliminar dirección:', error);

          let statusCode = 500;
          let errorMessage = 'Error al procesar la solicitud';

          if (error.sqlMessage) {
              // Clasificación de errores conocidos
              if (error.sqlMessage.includes('no existe')) {
                  statusCode = 404;
                  errorMessage = error.sqlMessage;
              } else if (error.sqlMessage.includes('no pertenece')) {
                  statusCode = 403;
                  errorMessage = 'La dirección no pertenece al cliente especificado';
              }
          }

          res.status(statusCode).json({
              success: false,
              error: errorMessage,
              ...(process.env.NODE_ENV === 'development' && {
                  details: {
                      sqlMessage: error.sqlMessage,
                      stack: error.stack
                  }
              })
          });
      }
    }

};

module.exports = clientController;
