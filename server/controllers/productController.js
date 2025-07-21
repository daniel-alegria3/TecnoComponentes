const pool = require('../database/db');

const productController = {

  // Obtener todos los productos
  getAllProducts: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Product');

      const productsWithParsed = rows.map(product => {
        let specsParsed = null;
        // Solo intentar convertir specs si no es NULL
        if (product.specs !== null) {
          try {
            // Convertir de BLOB a string y luego parsear como JSON
            const specsString = product.specs.toString('utf-8');
            specsParsed = JSON.parse(specsString);
          } catch (error) {
            // Si falla el parseo, dejar specs como null (puede ser por datos corruptos o mal formato)
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
          specs: specsParsed // Devuelve el objeto JSON o null si estaba vacío o malformado
        };
      });

      res.json(productsWithParsed);
    } catch (error) {
      console.error('Error en <getAllProducts>:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  getAllCategory: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Category');
      res.json(rows);
    } catch (error) {
      console.error('Error en getAllCategory:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener un producto por su ID
  getProductById: async (req, res) => {
    try {
      const [rows] = await pool.query('CALL ObtenerProductoPorId(?)', [req.params.id]);

      // Como CALL devuelve un array de arrays, accedemos a rows[0]
      const result = rows[0];

      if (result.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const product = result[0];
      if (product.specs !== null) {
        try {
          const specsString = product.specs.toString('utf-8');
          product.specs = JSON.parse(specsString);
        } catch (error) {
          console.warn(`Specs inválido para el producto ID ${product.id_product}:`, error.message);
          product.specs = null;
        }
      }
      if (product.images_path !== null) {
        product.images_path = product.images_path.split(',');
      }

      res.json(product);
    } catch (error) {
      console.error('Error en getProductById:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Crear un nuevo producto
  createProduct: async (req, res) => {
    const { name, images_path, brand, category,description, price, stock } = req.body;

    if (!name || name.trim() === '' || isNaN(price) || parseFloat(price) < 0 || isNaN(stock) || parseInt(stock) < 0 || !Number.isInteger(parseInt(stock))) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
      let result;
      [result] = await pool.query(`CALL CrearProducto(?, ?, ?, ?, ?, ?, ?, @id)`,
        [name.trim(),
         (Array.isArray(images_path) && images_path.length > 0) ? images_path.join(',') : null,
         brand.trim() !== "" ? brand.trim() : null,
         category.trim(),
         description.trim() !== "" ? description.trim() : null,
         parseFloat(price),
         parseInt(stock)
        ]
      );
      [result] = await pool.query(`SELECT @id AS id_product;`);
      console.log('res', result);
      res.status(201).json({
        message: 'Producto creado correctamente',
        id_product: result[0].id_product
      });
    } catch (error) {
      console.error('Error en createProduct:', error);
      res.status(500).json({ error: 'No se pudo crear el producto' });
    }
  },

  // Actualizar un producto existente
  updateProduct: async (req, res) => {
    const { name, images_path, brand, category, description, price, stock} = req.body;

    if (!name || name.trim() === '' || isNaN(price) || parseFloat(price) < 0 || isNaN(stock) || parseInt(stock) < 0 || !Number.isInteger(parseInt(stock))) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
      const [result] = await pool.query(
        `CALL ActualizarProducto(?, ?, ?, ?, ?, ?, ?, ?);`,
        [req.params.id, name.trim(),
          (Array.isArray(images_path) && images_path.length > 0) ? images_path.join(',') : null,
          brand.trim() !== "" ? brand.trim() : null,
          category.trim(),
          description.trim() !== "" ? description.trim() : null,
          parseFloat(price),
          parseInt(stock)
        ]
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
      const [result] = await pool.query('CALL EliminarProductoLogico(?);',
        [req.params.id]);

      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error en deleteProduct:', error);
      res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
  },

  getCategoryByProductId: async (req, res) => {
    try {
      const productId = req.params.id;
      const [rows] = await pool.query('CALL ObtenerCategoriaDeProducto(?);', [productId]);

      const result = rows[0];

      if (result.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada para el producto' });
      }

      const category = result[0].category_name;

      let specsTemplate = {};

      switch (category) {
        case 'Procesadores':
          specsTemplate = {
            // Cantidad de núcleos físicos. Ej: 4, 6, 8
            Numero_de_nucleos: '',
            // Cantidad de hilos de ejecución. Ej: 8, 12, 16
            Numero_de_hilos: '',
            // Velocidad base del procesador. Ej: "3.5 GHz"
            Frecuencia_base: '',
            // Velocidad máxima en modo turbo. Ej: "4.6 GHz"
            Frecuencia_max: '',
            // Caché L3, L2, etc. Ej: "16 MB"
            Caché: '',
            // Consumo térmico. Ej: "65 W"
            TDP: '',
            // Tipo de socket compatible. Ej: "AM4", "LGA1200"
            Socket: ''
          };
          break;

        case 'RAM':
          specsTemplate = {
            // Capacidad total. Ej: "8 GB", "16 GB"
            Capacidad: '',
            // Tipo de memoria. Ej: "DDR4", "DDR5"
            Tipo: '',
            // Frecuencia de operación. Ej: "3200 MHz"
            Frecuencia: '',
            // Latencia. Ej: "CL16"
            Latencia: '',
            // Voltaje de operación. Ej: "1.35 V"
            Voltaje: '',
            // Factor de forma. Ej: "DIMM", "SO-DIMM"
            Formato: ''
          };
          break;

        case 'SSD/HDD':
          specsTemplate = {
            // Tipo de unidad. Ej: "SSD", "HDD"
            Tipo: '',
            // Capacidad total. Ej: "1 TB", "512 GB"
            Capacidad: '',
            // Velocidad de lectura secuencial. Ej: "550 MB/s"
            Velocidad_lectura: '',
            // Velocidad de escritura secuencial. Ej: "500 MB/s"
            Velocidad_escritura: '',
            // Interfaz de conexión. Ej: "SATA", "NVMe", "PCIe"
            Interfaz: '',
            // Tamaño físico. Ej: "2.5\"", "M.2"
            Formato: ''
          };
          break;

        case 'Laptops':
          specsTemplate = {
            // Modelo del procesador. Ej: "Intel i5-1135G7"
            Procesador: '',
            // Capacidad de RAM. Ej: "16 GB"
            RAM: '',
            // Almacenamiento total. Ej: "512 GB SSD"
            Almacenamiento: '',
            // Tamaño y tipo de pantalla. Ej: "15.6\" FHD"
            Pantalla: '',
            // GPU dedicada o integrada. Ej: "RTX 3050", "Intel Iris Xe"
            GPU: '',
            // Sistema instalado. Ej: "Windows 11", "Ubuntu"
            Sistema_operativo: '',
            // Peso total. Ej: "1.8 kg"
            Peso: ''
          };
          break;

        case 'GPUs':
          specsTemplate = {
            // Modelo de GPU. Ej: "RTX 3060"
            Modelo: '',
            // Tamaño de memoria. Ej: "8 GB"
            Memoria: '',
            // Tipo de memoria usada. Ej: "GDDR6"
            Tipo_memoria: '',
            // Interfaz de conexión. Ej: "PCIe 4.0"
            Bus: '',
            // Frecuencia base. Ej: "1320 MHz"
            Frecuencia_base: '',
            // Frecuencia máxima. Ej: "1777 MHz"
            Frecuencia_boost: '',
            // Consumo estimado. Ej: "170 W"
            Consumo: ''
          };
          break;

        case 'Periférico':
          specsTemplate = {
            // Tipo de periférico. Ej: "Teclado", "Ratón", "Auriculares"
            Tipo: '',
            // Tipo de conexión. Ej: "USB", "Bluetooth", "Inalámbrico"
            Conectividad: '',
            // Modelo específico. Ej: "MX Master 3"
            Modelo: '',
            // Características adicionales. Ej: "Retroiluminado, Mecánico"
            Caracteristicas: ''
          };
          break;

        default:
          specsTemplate = { Mensaje: 'Categoría no reconocida' };
      }

      res.json({
        id_category: result[0].id_category,
        category_name: category,
        specsTemplate
      });

    } catch (error) {
      console.error('Error en getCategoryByProductId:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
  updateProductSpecs: async (req, res) => {
    try {
      const productId = req.params.id;
      const specsObject = req.body;

      if (!specsObject || typeof specsObject !== 'object') {
        return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un objeto JSON válido' });
      }

      // Convertir el JSON a string y luego a buffer binario
      const specsJsonString = JSON.stringify(specsObject);
      const specsBinary = Buffer.from(specsJsonString, 'utf-8');

      // Llamar al procedimiento almacenado
      await pool.query('CALL ActualizarSpecsProducto(?, ?)', [productId, specsBinary]);

      res.status(200).json({ message: 'Especificaciones actualizadas correctamente' });

    } catch (error) {
      console.error('Error en updateProductSpecs:', error);
      res.status(500).json({ error: 'Error al actualizar las especificaciones del producto' });
    }
  },

  // Función auxiliar para actualizar solo el stock de un producto
  updateProductStock: async (productId, newStock) => {
    try {
      // Obtener datos actuales del producto
      const [productRows] = await pool.query('SELECT * FROM Product WHERE id_product = ?', [productId]);
      
      if (productRows.length === 0) {
        throw new Error('Producto no encontrado');
      }

      const product = productRows[0];
      
      // Obtener nombre de la categoría
      const [categoryRows] = await pool.query('SELECT name FROM Category WHERE id_category = ?', [product.category]);
      const categoryName = categoryRows[0]?.name || '';

      // Actualizar usando el procedimiento existente
      await pool.query(
        `CALL ActualizarProducto(?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          productId,
          product.name,
          product.images_path,
          product.brand || '',
          categoryName,
          product.description || '',
          product.price,
          newStock
        ]
      );

      return true;
    } catch (error) {
      console.error('Error en updateProductStock:', error);
      throw error;
    }
  },
};

module.exports = productController;
