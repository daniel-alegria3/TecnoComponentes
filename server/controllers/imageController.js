require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');
const upload = multer({ storage: multer.memoryStorage() }); // Almacena en memoria

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
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
      // width: 'auto',
      // height: 'auto',
    },
    {
      crop: 'limit'
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

  createImage: [
    upload.single('file'), // Middleware Multer para procesar FormData
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
        }

        // Convertir buffer a stream (más eficiente para Cloudinary)
        const stream = Readable.from(req.file.buffer);
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            public_id: req.file.originalname.replace(/\.[^/.]+$/, ""),
            transformation: defaultOpts.transformation
          },
          (error, result) => {
            if (error && !result?.public_id) {
              console.error('Error en Cloudinary:', error);
              return res.status(500).json({ error: 'Error al subir la imagen' });
            }
            res.status(201).json({
              public_id: result.public_id,
              // url: cloudinary.url(result.public_id, {
              //   transformation: defaultOpts.transformation
              // })
            });
          }
        );

        stream.pipe(uploadStream);
      } catch (error) {
        console.error('Error en createImage:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  ],

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
