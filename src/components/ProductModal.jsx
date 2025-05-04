import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductModal = ({
  isOpen,
  onClose,
  product,
  onSave,
  mode = "add",
  categories = [],
  loadingCategories = false,
  categoriesError = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    image_path: "",
    brand: "",
    description: "",
    price: "",
    stock: "",
    category: categories[0]?.id || "", // Valor por defecto: primera categoría
  });
  const [errors, setErrors] = useState({});

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        image_path: product.image_path || "",
        brand: product.brand || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || categories[0]?.id || "",
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        image_path: "",
        brand: "",
        description: "",
        price: "",
        stock: "",
        category: categories[0]?.id || "",
      });
    }
    setErrors({});
  }, [product, mode, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.price.trim()) newErrors.price = "El precio es requerido";
    if (!formData.stock || Number(formData.stock) < 0)
      newErrors.stock = "El stock debe ser mayor o igual a 0";
    if (!formData.category) newErrors.category = "La categoría es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const productData = {
      ...formData,
      stock: Number(formData.stock),
      category: formData.category,
    };

    if (mode === "edit" && product) {
      onSave({
        ...product,
        ...productData,
        id_product: product.id_product,
      });
    } else {
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
              {mode === "edit" ? "Editar Producto" : "Agregar Producto"}
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

            {/* Categoría */}
            <label className="block mb-2">
              Categoría*:
              {loadingCategories ? (
                <div className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 animate-pulse h-10"></div>
              ) : categoriesError ? (
                <div className="text-red-500 text-sm">
                  Error cargando categorías
                </div>
              ) : categories.length > 0 ? (
                <>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category}</p>
                  )}
                </>
              ) : (
                <div className="text-yellow-600 text-sm">
                  No hay categorías disponibles
                </div>
              )}
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
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
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
