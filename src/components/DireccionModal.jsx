import { useState, useEffect } from "react";

const ModalDireccion = ({ isOpen, onClose, onSave, onSelect }) => {
  const [directionData, setDirectionData] = useState({
    Nombre: "",
    Telefono: "",
    Direccion: "",
    Apartamento: "",
    Provincia: "",
    Distrito: "",
    CodigoPostal: "",
  });

  const [errors, setErrors] = useState({
    Nombre: "",
    Telefono: "",
    Direccion: "",
    Provincia: "",
    Distrito: "",
  });

  const [activeTab, setActiveTab] = useState("list");
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar las direcciones
  const fetchDirecciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/clients/verdireccion",
        {
          credentials: "include",
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al cargar direcciones");
      }

      if (result.success && result.data) {
        setDirecciones(result.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar direcciones al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchDirecciones();
      setActiveTab("list");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    let formattedValue = value;
    if (name === "Telefono") {
      formattedValue = value.replace(/\D/g, "").slice(0, 9);
    } else if (name === "CodigoPostal") {
      formattedValue = value.replace(/\D/g, "").slice(0, 5);
    }

    setDirectionData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateNombre = (nombre) => {
    if (!nombre.trim()) return "El nombre es requerido";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre))
      return "Solo se permiten letras y espacios";
    if (nombre.length < 3) return "Mínimo 3 caracteres";
    return "";
  };

  const validateTelefono = (telefono) => {
    if (!telefono) return "El teléfono es requerido";
    if (!/^\d{9}$/.test(telefono)) return "Debe tener 9 dígitos";
    return "";
  };

  const validateDireccion = (direccion) => {
    if (!direccion.trim()) return "La dirección es requerida";
    if (direccion.length < 5) return "Mínimo 5 caracteres";
    return "";
  };

  const validateProvincia = (provincia) => {
    if (!provincia.trim()) return "La provincia es requerida";
    return "";
  };

  const validateDistrito = (distrito) => {
    if (!distrito.trim()) return "El distrito es requerido";
    return "";
  };

  const handleSubmit = async () => {
    // Validación de campos
    const newErrors = {
      Nombre: validateNombre(directionData.Nombre),
      Telefono: validateTelefono(directionData.Telefono),
      Direccion: validateDireccion(directionData.Direccion),
      Provincia: validateProvincia(directionData.Provincia),
      Distrito: validateDistrito(directionData.Distrito),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      // 1. Primero hacemos el fetch para guardar en la base de datos
      const response = await fetch(
        "http://localhost:5000/api/clients/creardireccion",
        {
          method: "POST",
          credentials: "include", // Para incluir cookies si usas sesiones
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name_surname: directionData.Nombre.trim(),
            phone: directionData.Telefono,
            physical_address: directionData.Direccion,
            apartment: directionData.Apartamento || null,
            province: directionData.Provincia,
            district: directionData.Distrito,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar la dirección");
      }

      // 2. Si el fetch fue exitoso, llamamos a onSave con los datos formateados
      onSave({
        receptorName: directionData.Nombre.trim(),
        telefono: directionData.Telefono,
        direccionCompleta: `${directionData.Direccion}${
          directionData.Apartamento ? `, ${directionData.Apartamento}` : ""
        }`,
        provincia: directionData.Provincia,
        distrito: directionData.Distrito,
        codigoPostal: directionData.CodigoPostal,
      });

      // Opcional: Cerrar el modal después de guardar
      onClose();
    } catch (error) {
      console.error("Error al guardar la dirección:", error);
      // Mostrar error al usuario
      setErrors({
        ...errors,
        submitError: error.message || "Error al guardar la dirección",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Dirección de Entrega</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "list"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Mis Direcciones
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "new"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("new")}
          >
            Nueva Dirección
          </button>
        </div>

        {activeTab === "list" ? (
          <div className="space-y-3 mb-4">
            {loading ? (
              <div className="text-center py-4">
                <p>Cargando direcciones...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : direcciones.length > 0 ? (
              direcciones.map((direccion, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() =>
                    onSelect({
                      idAdress: direccion.id_address,
                      receptorName: direccion.name_surname,
                      telefono: direccion.phone,
                      direccionCompleta: `${direccion.physical_address}${
                        direccion.apartment ? `, ${direccion.apartment}` : ""
                      }`,
                      provincia: direccion.province,
                      distrito: direccion.district,
                      codigoPostal: direccion.postal_code || "",
                    })
                  }
                >
                  <p className="font-medium">
                    {direccion.name_surname} - {direccion.phone}
                  </p>
                  <p className="text-gray-700">
                    {direccion.physical_address}
                    {direccion.apartment && `, ${direccion.apartment}`}
                  </p>
                  <p className="text-gray-600">
                    {direccion.district}, {direccion.province}
                  </p>
                  {direccion.postal_code && (
                    <p className="text-gray-500 text-sm">
                      Código Postal: {direccion.postal_code}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                  No hay direcciones existentes
                </p>
                <button
                  onClick={() => setActiveTab("new")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar primera dirección
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Nombre y Teléfono */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre*
                </label>
                <input
                  type="text"
                  name="Nombre"
                  value={directionData.Nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.Nombre
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  placeholder="Nombre completo"
                />
                {errors.Nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.Nombre}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono*
                </label>
                <input
                  type="tel"
                  name="Telefono"
                  value={directionData.Telefono}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.Telefono
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  placeholder="987654321"
                  maxLength="9"
                />
                {errors.Telefono && (
                  <p className="mt-1 text-sm text-red-600">{errors.Telefono}</p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección*
              </label>
              <input
                type="text"
                name="Direccion"
                value={directionData.Direccion}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                  errors.Direccion
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
                placeholder="Av. Principal 123"
              />
              {errors.Direccion && (
                <p className="mt-1 text-sm text-red-600">{errors.Direccion}</p>
              )}
            </div>

            {/* Apartamento (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartamento (opcional)
              </label>
              <input
                type="text"
                name="Apartamento"
                value={directionData.Apartamento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Departamento, Piso, etc."
              />
            </div>

            {/* Provincia, Distrito y Código Postal */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia*
                </label>
                <input
                  type="text"
                  name="Provincia"
                  value={directionData.Provincia}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.Provincia
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  placeholder="Cusco"
                />
                {errors.Provincia && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.Provincia}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distrito*
                </label>
                <input
                  type="text"
                  name="Distrito"
                  value={directionData.Distrito}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.Distrito
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  placeholder="Cusco"
                />
                {errors.Distrito && (
                  <p className="mt-1 text-sm text-red-600">{errors.Distrito}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="CodigoPostal"
                  value={directionData.CodigoPostal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="08001"
                  maxLength="5"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">* Campos obligatorios</p>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Dirección
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDireccion;
