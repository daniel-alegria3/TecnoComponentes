import { useState } from "react";

const ModalDireccion = ({ isOpen, onClose, onSave }) => {
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
    Distrito: ""
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Formateo especial para ciertos campos
    let formattedValue = value;
    if (name === "Telefono") {
      // Solo permitir números y limitar a 9 dígitos
      formattedValue = value.replace(/\D/g, "").slice(0, 9);
    } else if (name === "CodigoPostal") {
      // Solo permitir números y limitar a 5 dígitos
      formattedValue = value.replace(/\D/g, "").slice(0, 5);
    }

    setDirectionData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateNombre = (nombre) => {
    if (!nombre.trim()) return "El nombre es requerido";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return "Solo se permiten letras y espacios";
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

  const handleSubmit = () => {
    const newErrors = {
      Nombre: validateNombre(directionData.Nombre),
      Telefono: validateTelefono(directionData.Telefono),
      Direccion: validateDireccion(directionData.Direccion),
      Provincia: validateProvincia(directionData.Provincia),
      Distrito: validateDistrito(directionData.Distrito)
    };

    setErrors(newErrors);

    // Verificar si hay errores
    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    onSave({
      receptorName: directionData.Nombre.trim(),
      telefono: directionData.Telefono,
      direccionCompleta: `${directionData.Direccion}${
        directionData.Apartamento ? `, ${directionData.Apartamento}` : ""
      }`,
      provincia: directionData.Provincia,
      distrito: directionData.Distrito,
      codigoPostal: directionData.CodigoPostal
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Agregar Nueva Dirección</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

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
                  errors.Nombre ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
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
                  errors.Telefono ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
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
                errors.Direccion ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
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
                  errors.Provincia ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                placeholder="Cusco"
              />
              {errors.Provincia && (
                <p className="mt-1 text-sm text-red-600">{errors.Provincia}</p>
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
                  errors.Distrito ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
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
          
          {/* Nota sobre campos obligatorios */}
          <p className="text-xs text-gray-500">* Campos obligatorios</p>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
          >
            Guardar Dirección
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDireccion;