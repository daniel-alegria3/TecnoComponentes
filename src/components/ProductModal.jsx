import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductModal = ({ isOpen, onClose, product, onSave, mode = 'add' }) => {
  // Estados para todos los campos del formulario
  const [formData, setFormData] = useState({
    name: '',
    image_path: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
  });
  const [errors, setErrors] = useState({});

  // Cargar datos del producto cuando se abre el modal en modo edición
  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        image_path: product.image_path || '',
        brand: product.brand || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
      });
    } else if (mode === 'add') {
      // Resetear el formulario cuando se usa para añadir
      setFormData({
        name: '',
        image_path: '',
        brand: '',
        description: '',
        price: '',
        stock: '',
      });
    }
    setErrors({});
  }, [product, mode, isOpen]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validar el formulario
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.price.trim()) newErrors.price = 'El precio es requerido';
    if (!formData.stock || Number(formData.stock) < 0) newErrors.stock = 'El stock debe ser mayor o igual a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar el producto (nuevo o actualizado)
  const handleSave = () => {
    if (!validate()) return;

    const productData = {
      ...formData,
      stock: Number(formData.stock)
    };

    if (mode === 'edit' && product) {
      // Para edición, mantener el ID y otros campos que no están en el formulario
      onSave({
        ...product,
        ...productData,
        id_product: product.id_product
      });
    } else {
      // Para añadir nuevo producto
      onSave(productData);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {mode === 'edit' ? 'Editar Producto' : 'Agregar Producto'}
            </h2>

            {/* Nombre */}
            <label className="block mb-2">
              Nombre*:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </label>

            {/* Imagen URL */}
            <label className="block mb-2">
              Imagen URL:
              <input
                type="text"
                name="image_path"
                value={formData.image_path}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>

            {/* Marca */}
            <label className="block mb-2">
              Marca:
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>

            {/* Descripción */}
            <label className="block mb-2">
              Descripción:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>

            {/* Precio */}
            <label className="block mb-2">
              Precio*:
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
              {errors.precioVenta && (
                <p className="text-red-500 text-sm">{errors.precioVenta}</p>
              )}
            </label>

            {/* Stock */}
            <label className="block mb-4">
              Stock*:
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock}</p>
              )}
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
