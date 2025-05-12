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
  cloudName = "dtcrgpax8", // Añadido parámetro para el nombre de Cloudinary
}) => {
  const [formData, setFormData] = useState({
    name: "",
    images_path: [], // Array consistente para almacenar IDs de Cloudinary
    brand: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [errors, setErrors] = useState({});
  const [localImagePreviews, setLocalImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState([]); // Para seguir el estado de carga de cada imagen

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (product && mode === "edit") {
      // Asegurarse de que images_path siempre sea un array
      let imagePaths = [];
      if (product.images_path) {
        if (Array.isArray(product.images_path)) {
          imagePaths = product.images_path;
        } else if (typeof product.images_path === "string") {
          // Si es un string, dividir por comas y eliminar espacios
          imagePaths = product.images_path
            .split(",")
            .map((path) => path.trim())
            .filter(Boolean);
        }
      }

      setFormData({
        name: product.name || "",
        images_path: imagePaths,
        brand: product.brand || "",
        description: product.description || "",
        price: product.price ? String(product.price) : "", // Convertir a string para el input
        stock: product.stock !== undefined ? String(product.stock) : "", // Convertir a string para el input
        category: product.category || "",
      });
    } else if (mode === "add") {
      // Resetear form al añadir
      setFormData({
        name: "",
        images_path: [],
        brand: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });
    }
    setErrors({});
    setLocalImagePreviews([]);
    setUploadingImages([]);
  }, [product, mode, isOpen]);

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

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validar tipos y tamaños
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      // Opcional: mostrar mensaje de error por archivos inválidos
      console.warn("Algunos archivos fueron omitidos por ser inválidos");
    }

    const newPreviews = await Promise.all(
      validFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return {
          file,
          preview: URL.createObjectURL(file),
          bytes: arrayBuffer,
          uploading: false,
          error: false,
        };
      })
    );

    setLocalImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = ""; // Limpiar input para permitir seleccionar el mismo archivo
  };

  const handleRemoveLocalImage = (index) => {
    setLocalImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview); // Liberar memoria
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images_path];
      newImages.splice(index, 1);
      return {
        ...prev,
        images_path: newImages,
      };
    });
  };

  const onCloseModal = () => {
    // Limpiar estados y cerrar
    setShowNewCategoryInput(false);
    onClose();
  };

  const uploadToCloudinary = async (file, index) => {
    // Actualizar estado para mostrar que esta imagen específica está cargando
    setUploadingImages((prev) => [...prev, index]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      // Actualizar estado para quitar esta imagen de la lista de carga
      setUploadingImages((prev) => prev.filter((i) => i !== index));

      return data.public_id;
    } catch (error) {
      console.error("Error subiendo la imagen:", error);

      // Marcar esta imagen como fallida y quitar de la lista de carga
      setLocalImagePreviews((prev) => {
        const newPreviews = [...prev];
        if (newPreviews[index]) {
          newPreviews[index].error = true;
        }
        return newPreviews;
      });

      setUploadingImages((prev) => prev.filter((i) => i !== index));
      throw error;
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validaciones más robustas
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.price.trim()) {
      newErrors.price = "El precio es requerido";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "El precio debe ser un número positivo";
    }

    if (!formData.stock.trim()) {
      newErrors.stock = "El stock es requerido";
    } else if (
      isNaN(parseInt(formData.stock)) ||
      parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "El stock debe ser un número mayor o igual a 0";
    }

    if (!formData.category) {
      newErrors.category = "La categoría es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsUploading(true);
    const uploadErrors = [];

    try {
      // 1. Subir imágenes locales a Cloudinary
      const uploadPromises = localImagePreviews.map((preview, index) =>
        uploadToCloudinary(preview.file, index)
      );

      const uploadedIds = await Promise.allSettled(uploadPromises);

      // Filtrar solo las subidas exitosas
      const successfulIds = uploadedIds
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      // Guardar errores para posible notificación
      uploadedIds.forEach((result, index) => {
        if (result.status === "rejected") {
          uploadErrors.push(
            `Error al subir "${localImagePreviews[index].file.name}": ${result.reason}`
          );
        }
      });

      // 2. Combinar con imágenes existentes
      // Convertir formData.images_path de string a array si es necesario
      const currentImages = Array.isArray(formData.images_path)
        ? formData.images_path
        : formData.images_path
        ? formData.images_path.split(",")
        : [];

      const allImageIds = [...currentImages, ...successfulIds];

      // 3. Preparar datos finales - convertir array a string para la BD
      const productData = {
        ...formData,
        images_path: allImageIds.join(","), // Convertir a string separado por comas
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };
      console.log("Datos del producto:", productData);

      // 4. Llamar a onSave
      if (mode === "edit" && product) {
        await onSave({
          ...productData,
          id_product: product.id_product,
        });
      } else {
        await onSave(productData);
      }

      // Si hay errores de subida, informar pero no impedir guardar el producto
      if (uploadErrors.length > 0) {
        console.warn("Algunas imágenes no pudieron subirse:", uploadErrors);
        // Aquí podrías mostrar un toast al usuario
      }

      onClose();
    } catch (error) {
      console.error("Error guardando producto:", error);
      // Mostrar error general al usuario
    } finally {
      setIsUploading(false);
    }
  };
  // Limpiar URLs de objeto al desmontar
  useEffect(() => {
    return () => {
      localImagePreviews.forEach((preview) => {
        if (preview.preview) {
          URL.revokeObjectURL(preview.preview);
        }
      });
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 id="modal-title" className="text-xl font-semibold mb-4">
              {mode === "edit" ? "Editar Producto" : "Agregar Producto"}
            </h2>

            {/* Nombre */}
            <label className="block mb-2">
              <span className="text-sm font-medium">Nombre*:</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.name ? "border-red-500" : ""
                }`}
                disabled={isUploading}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-red-500 text-sm mt-1">
                  {errors.name}
                </p>
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
                  aria-label="Seleccionar imágenes"
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
                    aria-label="Seleccionar archivos"
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
                    key={`${preview.file.name}-${index}`}
                    className="relative group"
                  >
                    <div className="relative">
                      <img
                        src={preview.preview}
                        alt={`Vista previa ${index + 1}`}
                        className={`w-full h-24 object-cover rounded-lg border shadow-sm ${
                          preview.error ? "border-red-500 opacity-50" : ""
                        } ${
                          uploadingImages.includes(index) ? "opacity-50" : ""
                        }`}
                      />
                      {uploadingImages.includes(index) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="animate-spin h-5 w-5 text-blue-600"
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
                        </div>
                      )}
                      {preview.error && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl">
                          Error
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveLocalImage(index);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={isUploading || uploadingImages.includes(index)}
                      title="Eliminar imagen"
                      aria-label="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Imágenes ya subidas */}
              {Array.isArray(formData.images_path) &&
                formData.images_path.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {formData.images_path.map((imageId, index) => (
                      <div
                        key={`cloud-${imageId}-${index}`}
                        className="relative group"
                      >
                        <img
                          src={`https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_200,c_fill/${imageId}`}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border shadow-sm"
                          onError={(e) => {
                            // Manejo de error de carga
                            e.target.src =
                              "https://via.placeholder.com/200?text=Error";
                            e.target.classList.add("border-red-500");
                          }}
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
                          aria-label="Eliminar imagen"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Marca */}
            <label className="block mb-2">
              <span className="text-sm font-medium">Marca:</span>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
                disabled={isUploading}
                aria-label="Marca del producto"
              />
            </label>

            {/* Categoría */}
            <div className="block mb-2">
              <span className="block text-sm font-medium">Categoría*:</span>
              {loadingCategories ? (
                <div className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 animate-pulse h-10"></div>
              ) : categoriesError ? (
                <div className="text-red-500 text-sm">
                  Error cargando categorías: {categoriesError}
                </div>
              ) : categories.length > 0 ? (
                <>
                  {!showNewCategoryInput ? (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full border rounded px-3 py-2 mt-1 ${
                        errors.category ? "border-red-500" : ""
                      }`}
                      required
                      disabled={isUploading}
                      aria-invalid={errors.category ? "true" : "false"}
                      aria-describedby={
                        errors.category ? "category-error" : undefined
                      }
                    >
                      <option value="" disabled>
                        Selecciona una categoría
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="other">Otra</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        placeholder="Nombre de la nueva categoría"
                        className={`w-full border rounded px-3 py-2 ${
                          errors.category ? "border-red-500" : ""
                        }`}
                        required
                        autoFocus
                        disabled={isUploading}
                        aria-invalid={errors.category ? "true" : "false"}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryInput(false);
                          setFormData((prev) => ({ ...prev, category: "" }));
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Cancelar nueva categoría"
                        disabled={isUploading}
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
                    <p
                      id="category-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.category}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-yellow-600 text-sm mt-1">
                  No hay categorías disponibles
                </div>
              )}
            </div>

            {/* Descripción */}
            <label className="block mb-2">
              <span className="text-sm font-medium">Descripción:</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2 mt-1"
                disabled={isUploading}
                aria-label="Descripción del producto"
              />
            </label>

            {/* Precio */}
            <label className="block mb-2">
              <span className="text-sm font-medium">Precio*:</span>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.price ? "border-red-500" : ""
                }`}
                placeholder="0.00"
                disabled={isUploading}
                aria-invalid={errors.price ? "true" : "false"}
                aria-describedby={errors.price ? "price-error" : undefined}
              />
              {errors.price && (
                <p id="price-error" className="text-red-500 text-sm mt-1">
                  {errors.price}
                </p>
              )}
            </label>

            {/* Stock */}
            <label className="block mb-4">
              <span className="text-sm font-medium">Stock*:</span>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                step="1"
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.stock ? "border-red-500" : ""
                }`}
                disabled={isUploading}
                aria-invalid={errors.stock ? "true" : "false"}
                aria-describedby={errors.stock ? "stock-error" : undefined}
              />
              {errors.stock && (
                <p id="stock-error" className="text-red-500 text-sm mt-1">
                  {errors.stock}
                </p>
              )}
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={onCloseModal}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                disabled={isUploading}
                type="button"
                aria-label="Cancelar"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                disabled={isUploading}
                type="button"
                aria-label={isUploading ? "Guardando..." : "Guardar"}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
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
