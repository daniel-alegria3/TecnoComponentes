import { useState, useEffect } from 'react';
import {motion, AnimatePresence } from 'framer-motion';

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stock, setStock] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setNombre(product.nombre);
      setPrecioVenta(product.precioVenta);
      setStock(product.stock);
      setErrors({});
    }
  }, [product]);

  const validate = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!precioVenta.trim()) newErrors.precioVenta = 'El precio es requerido';
    if (!stock || stock < 0) newErrors.stock = 'El stock debe ser mayor o igual a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const updatedProduct = {
      ...product,
      nombre,
      precioVenta,
      stock: Number(stock),
    };
    onSave(updatedProduct);
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
            <h2 className="text-xl font-semibold mb-4">Editar Producto</h2>

            <label className="block mb-2">
              Nombre:
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm">{errors.nombre}</p>
              )}
            </label>

            <label className="block mb-2">
              Precio:
              <input
                type="text"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
              {errors.precioVenta && (
                <p className="text-red-500 text-sm">{errors.precioVenta}</p>
              )}
            </label>

            <label className="block mb-4">
              Stock:
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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

export default EditProductModal;
