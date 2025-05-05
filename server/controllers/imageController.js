require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'degeoyvyx',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const defaultOpts = {
  transformation : [
    {
      quality: 'auto',
      fetch_format: 'auto'
    },
    {
      width: '200',
      height: '200',
    },
  ]
}

/// SUBIR IMAGEN
// const results = cloudinary.uploader.upload('./imagenes/ejemplo.png')

/// CONSEGUIR IMAGEN DESPUES DE SUBIR
// const url = cloudinary.url(results.public_id, defaultOpts);

/// CONSEGUIR URL DE IMAGEN YA SUBIDA, se puede sacar de la pagina web
// const url = cloudinary.url('my-uploaded-image-public-id', defaultOpts);

const productController = {

  // Obtener todos los imagenes
  getAllImages: async (req, res) => {
    try {
      const result = await cloudinary.search
        .expression('resource_type:image') // You can narrow by folder: 'folder_name/*' if needed
        .sort_by('created_at', 'desc')
        .max_results(100) // FUTURE BUG: Adjust as needed or implement pagination
        .execute();

      const images = result.resources.map((img) => ({
        public_id: img.public_id,
        url: cloudinary.url(img.public_id, defaultOpts),
        created_at: img.created_at,
        format: img.format,
        width: img.width,
        height: img.height,
      }));

      res.json(images);
    } catch (error) {
      console.error('Error en getAllImages:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Crear un nuevo imagen
  createImage: async (req, res) => {
    const { filepath, image_bytes } = req.body;

    // Check if image_bytes exists
    if (!image_bytes) {
      return res.status(400).json({ error: 'Bytes de la imagen no encontrados' });
    }

    // Optional: get extension from filepath if needed
    const extension = filepath?.split('.').pop() || 'png'; // default to png if missing

    // Validate that image_bytes is a valid image (basic check)
    const isBase64 = /^data:image\/(png|jpeg|jpg|gif);base64,/.test(image_bytes);
    if (!isBase64) {
      return res.status(400).json({ error: 'image_bytes no contiene datos de imagen válidos' });
    }

    try {
      const uploadResult = await cloudinary.uploader.upload(image_bytes, {
        public_id: filepath ? filepath.replace(/\.[^/.]+$/, "") : undefined, // strip extension
        resource_type: 'image',
      });

      res.status(201).json({
        message: 'Imagen creada correctamente',
        public_id: uploadResult.public_id,
        url: cloudinary.url(uploadResult.public_id, defaultOpts),
      });
    } catch (error) {
      console.error('Error en createImage:', error);
      res.status(500).json({ error: 'No se pudo crear la imagen' });
    }
  },

  // Eliminar un producto
  deleteImage: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await cloudinary.uploader.destroy(id);

      if (result.result !== 'ok') {
        return res.status(404).json({ error: 'Imagen no encontrada para eliminar' });
      }
      res.json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
      console.error('Error en deleteImage:', error);
      res.status(500).json({ error: 'No se pudo eliminar la imagen' });
    }
  },

  // Obtener un imagen por su ID
  getImageById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await cloudinary.api.resource(id); // fails if id not in claudinary

      console.log(url);
      res.json({
        public_id: id,
        url: cloudinary.url(id, defaultOpts),
        metadata: result,
      });
    } catch (error) {
      if (error.http_code === 404) {
        return res.status(404).json({ error: 'Imagen no encontrada' });
      }
      console.error('Error en getImageById:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Actualizar un producto existente
  // updateImage: async (req, res) => {
  // },
};

module.exports = productController;
