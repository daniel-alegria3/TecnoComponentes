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
    image_path: [], // Ahora contendrá IDs de Cloudinary
    brand: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [errors, setErrors] = useState({});
  const [localImagePreviews, setLocalImagePreviews] = useState([]); // Para imágenes locales antes de subir
  const [isUploading, setIsUploading] = useState(false);

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        image_path: Array.isArray(product.image_path)
          ? product.image_path
          : product.image_path
          ? [product.image_path]
          : [],
        brand: product.brand || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "",
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        image_path: [],
        brand: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });
    }
    setErrors({});
    setLocalImagePreviews([]); // Limpiar previews al abrir/cerrar
  }, [product, mode, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category" && value === "other") {
      setShowNewCategoryInput(true);
      setFormData((prev) => ({ ...prev, [name]: "" }));
    } else {
      setShowNewCategoryInput(false);
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
    }));

    setLocalImagePreviews([...localImagePreviews, ...newPreviews]);
    e.target.value = ""; // Reset input
  };

  const handleRemoveLocalImage = (index) => {
    const newPreviews = [...localImagePreviews];
    URL.revokeObjectURL(newPreviews[index].preview); // Liberar memoria
    newPreviews.splice(index, 1);
    setLocalImagePreviews(newPreviews);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.image_path];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      image_path: newImages,
    });
  };

  const onCloseModal = () => {
    onClose();
    setShowNewCategoryInput(false);
  }
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tu_upload_preset"); // Reemplaza con tu upload preset

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload", // Reemplaza con tu cloud name
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("Error al subir imagen");
    return await response.json();
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

  const handleSave = async () => {
    if (!validate()) return;
    setIsUploading(true);

    try {
      // Subir imágenes locales a Cloudinary
      const uploadedIds = [];
      for (const preview of localImagePreviews) {
        try {
          const data = await uploadToCloudinary(preview.file);
          uploadedIds.push(data.public_id);
        } catch (error) {
          console.error("Error subiendo imagen:", error);
          // Continuar con las demás imágenes
        }
      }

      // Preparar datos finales
      const productData = {
        ...formData,
        image_path: [...formData.image_path, ...uploadedIds],
        stock: Number(formData.stock),
        category: formData.category,
      };

      // Llamar a onSave (que enviará al backend)
      if (mode === "edit" && product) {
        await onSave({
          ...product,
          ...productData,
          id_product: product.id_product,
        });
      } else {
        await onSave(productData);
      }
      onClose();
    } catch (error) {
      console.error("Error guardando producto:", error);
      // Mostrar error al usuario si es necesario
    } finally {
      setIsUploading(false);
    }
  };

  // Limpiar URLs de objeto al desmontar
  useEffect(() => {
    return () => {
      localImagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.preview);
      });
    };
  }, [localImagePreviews]);

  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto"
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
                disabled={isUploading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </label>

            {/* Imágenes */}
            <div className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Imágenes
              </span>

              {/* Área de carga personalizada */}
              <label className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium ${
                      isUploading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                    disabled={isUploading}
                  >
                    Seleccionar archivos
                  </button>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF hasta 5MB cada una
                  </p>
                </div>

                {localImagePreviews.length > 0 && (
                  <p className="mt-3 text-sm text-blue-600 font-medium">
                    {localImagePreviews.length}{" "}
                    {localImagePreviews.length === 1
                      ? "archivo listo"
                      : "archivos listos"}
                  </p>
                )}
              </label>

              {/* Previews de imágenes locales */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {localImagePreviews.map((preview, index) => (
                  <div
                    key={`${preview.file.name}-${preview.file.lastModified}`}
                    className="relative group"
                  >
                    <img
                      src={preview.preview}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveLocalImage(index);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={isUploading}
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Imágenes ya subidas */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {formData.image_path.map((imageId, index) => (
                  <div key={`cloud-${index}`} className="relative group">
                    <img
                      src={`https://res.cloudinary.com/tu_cloud_name/image/upload/w_200,h_200,c_fill/${imageId}`}
                      alt={`Imagen ${index}`}
                      className="w-full h-24 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveImage(index);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={isUploading}
                      title="Eliminar imagen"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Marca */}
            <label className="block mb-2">
              Marca:
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
                disabled={isUploading}
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
                  {!showNewCategoryInput ? (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === "other") {
                          setShowNewCategoryInput(true);
                          setFormData((prev) => ({ ...prev, category: "" }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }));
                        }
                      }}
                      className="w-full border rounded px-3 py-2 mt-1"
                      required
                      disabled={isUploading}
                    >
                      <option value="" disabled selected>
                        Selecciona una categoría
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="other">Otra</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value })}
                        placeholder="Nombre de la nueva categoría"
                        className="w-full border rounded px-3 py-2"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryInput(false);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

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
                disabled={isUploading}
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
                disabled={isUploading}
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
                disabled={isUploading}
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock}</p>
              )}
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={onCloseModal}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={isUploading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
