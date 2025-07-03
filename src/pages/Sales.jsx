import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "../context/SessionContext";
import Modal from "../components/TarjetaModal";
import ModalDireccion from "../components/DireccionModal";

import {
  CreditCardIcon,
  TruckIcon,
  HomeIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import useProductImages from "../composables/useProductImages";

export default function Checkout() {
  // 1. Primero TODOS los Hooks - en orden consistente
  const { isLoggedIn } = useSession();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Todos los estados con useState
  const [isTarjetaModalOpen, setIsTarjetaModalOpen] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [metodoEntrega, setMetodoEntrega] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [tarjetaGuardada, setTarjetaGuardada] = useState(null);
  const [showCardFeedback, setShowCardFeedback] = useState(false);

 // Estados para dirección
 const [isDireccionModalOpen, setIsDireccionModalOpen] = useState(false);
 const [direccionGuardada, setDireccionGuardada] = useState(null);
 const [direcciones, setDirecciones] = useState([]);
 const [showFeedback, setShowFeedback] = useState(false);
 const [loadingDirecciones, setLoadingDirecciones] = useState(true);

  // Cargar direcciones al montar el componente
  useEffect(() => {
  const fetchDirecciones = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clients/verdireccion', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('dataJohanxd',data)
      if (response.ok && data.length > 0) {
        setDirecciones(data);
        // Establecer la primera dirección como la predeterminada
        setDireccionGuardada({
          receptorName: data[0].Nombre,
          telefono: data[0].Telefono,
          direccionCompleta: `${data[0].Direccion}${data[0].Apartamento ? `, ${data[0].Apartamento}` : ''}`,
          provincia: data[0].Provincia,
          distrito: data[0].Distrito,
          codigoPostal: data[0].CodigoPostal
        });
      }
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    } finally {
      setLoadingDirecciones(false);
    }
  };

  if (isLoggedIn) {
    fetchDirecciones();
  }
  }, [isLoggedIn]);


  // 2. Validaciones después de todos los Hooks
  if (!isLoggedIn) {
    return (
      <div>
        <h2>Iniciar sesión para ver la página de Venta</h2>
      </div>
    );
  }

  // 3. Funciones del componente
  const openModalTarjeta = () => {
    setIsTarjetaModalOpen(true);
  };

  const closeModalTarjeta = () => {
    setIsTarjetaModalOpen(false);
  };

  const handleGuardarTarjeta = (tarjetaData) => {
    setTarjetaGuardada(tarjetaData);
    setShowCardFeedback(true);
    setMetodoPago("tarjeta");
    setTimeout(() => {
      setShowCardFeedback(false);
    }, 2000);
    closeModalTarjeta();
  };

  // Funciones para dirección
  const openModalDireccion = () => {
    setIsDireccionModalOpen(true);
  };

  const closeModalDireccion = () => {
    setIsDireccionModalOpen(false);
  };

  const handleGuardarDireccion = (direccionData) => {
    setDireccionGuardada(direccionData);
    setShowFeedback(true);

    // Ocultar el feedback después de 3 segundos
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);

    closeModalDireccion();
  };
  const handleSeleccionarDireccion = (direccion) => {
    setDireccionGuardada({
      receptorName: direccion.Nombre,
      telefono: direccion.Telefono,
      direccionCompleta: `${direccion.Direccion}${direccion.Apartamento ? `, ${direccion.Apartamento}` : ''}`,
      provincia: direccion.Provincia,
      distrito: direccion.Distrito,
      codigoPostal: direccion.CodigoPostal
    });
    closeModalDireccion();
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const entrega = 0.0;
  const total = subtotal + entrega;

  const handlePagar = async () => {
    if (!metodoPago || !metodoEntrega) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    setPaymentSuccess(true);
  };

  function SalesItem({ product, quantity }) {
    const { imageUrls, isLoading: isImagesLoading } = useProductImages(
      product?.images_path || []
    );

    return (
      <div>
        <div key={product.product_id} className="text-center">
          <div className="w-20 h-20 bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
            {isImagesLoading ? (
              <div></div>
            ) : (
              <img
                src={imageUrls[0]}
                alt={product.name}
                onClick={() => navigate(`/product/${product.id_product}`)}
              />
            )}
          </div>
          <div className="text-sm font-medium">
            ${parseFloat(product.price).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">x {quantity}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-monofur min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Tecno<span className="text-violet-500">Components</span>
        </h1>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dirección de entrega */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                Dirección de entrega
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  {loadingDirecciones ? (
                    <div className="animate-pulse bg-gray-200 h-10 w-full rounded-md"></div>
                  ) : direccionGuardada ? (
                    <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-md border w-full">
                      <p className="text-violet-600 font-medium">
                        {direccionGuardada.receptorName} -{" "}
                        {direccionGuardada.telefono}
                      </p>
                      <p>{direccionGuardada.direccionCompleta}</p>
                      <p>
                        {direccionGuardada.distrito},{" "}
                        {direccionGuardada.provincia}
                      </p>
                      {direccionGuardada.codigoPostal && (
                        <p>Código Postal: {direccionGuardada.codigoPostal}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-md border w-full">
                      No hay direcciones registradas
                    </p>
                  )}
                  <button
                    onClick={openModalDireccion}
                    className="ml-3 text-blue-600 hover:text-blue-700 text-sm font-medium underline whitespace-nowrap"
                  >
                    {direccionGuardada ? "Cambiar" : "Agregar"}
                  </button>
                </div>

                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-green-600 text-sm"
                    >
                      ¡Dirección guardada correctamente!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Modal de dirección modificado */}
            <ModalDireccion
              isOpen={isDireccionModalOpen}
              onClose={closeModalDireccion}
              onSave={handleGuardarDireccion}
              direcciones={direcciones}
              onSelect={handleSeleccionarDireccion}
            />
            {/* Método de pago */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Método de pago</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      checked={metodoPago === "tarjeta"}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                    />
                    <CreditCardIcon className="h-5 w-5 text-gray-500" />
                    <span className={tarjetaGuardada ? "text-violet-600" : ""}>
                      {tarjetaGuardada
                        ? `Tarjeta terminada en ${tarjetaGuardada.lastFourDigits} (${tarjetaGuardada.ownerName})`
                        : "Tarjeta de débito/crédito"}
                    </span>
                  </div>
                  {metodoPago === "tarjeta" && (
                    <button
                      onClick={openModalTarjeta}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                    >
                      {tarjetaGuardada ? "Cambiar" : "Agregar"}
                    </button>
                  )}
                </label>
                {/* Feedback de dirección guardada */}
                <AnimatePresence>
                  {showCardFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-green-600 text-sm"
                    >
                      ¡Tarjeta guardada correctamente!
                    </motion.div>
                  )}
                </AnimatePresence>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="yape"
                      checked={metodoPago === "yape"}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                    />
                    <div className="h-5 w-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      Y
                    </div>
                    <span>Yape</span>
                  </div>
                  {metodoPago === "yape" && (
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
                      Cambiar
                    </button>
                  )}
                </label>
              </div>
            </div>
            <Modal
              isOpen={isTarjetaModalOpen}
              onClose={closeModalTarjeta}
              onSave={handleGuardarTarjeta}
            />
            {/* Método de entrega */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Método de entrega</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="metodoEntrega"
                      value="domicilio"
                      checked={metodoEntrega === "domicilio"}
                      onChange={(e) => setMetodoEntrega(e.target.value)}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                    />
                    <TruckIcon className="h-5 w-5 text-gray-500" />
                    <span>Envío a domicilio</span>
                  </div>
                  {metodoEntrega === "domicilio" && (
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
                      Cambiar
                    </button>
                  )}
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="metodoEntrega"
                      value="tienda"
                      checked={metodoEntrega === "tienda"}
                      onChange={(e) => setMetodoEntrega(e.target.value)}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                    />
                    <BuildingStorefrontIcon className="h-5 w-5 text-gray-500" />
                    <span>Recojo en tienda</span>
                  </div>
                  {metodoEntrega === "tienda" && (
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
                      Cambiar
                    </button>
                  )}
                </label>
              </div>
            </div>

            {/* Detalles de items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Detalles de ítems</h2>
              <div className="flex gap-4">
                {cartItems.map(({ product, quantity }) => (
                  <SalesItem product={product} quantity={quantity} />
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Resumen</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Productos ({cartItems.length})
                  </span>
                  <span>${subtotal.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entrega</span>
                  <span>${entrega.toFixed(1)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePagar}
                disabled={loading || !metodoPago || !metodoEntrega}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  loading || !metodoPago || !metodoEntrega
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Procesando..." : "Pagar"}
              </button>

              {/* Modal */}
              <AnimatePresence>
                {paymentSuccess && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-2xl font-semibold text-green-600">
                        Pago Exitoso!
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Gracias por su preferencia. Revise su orden su la pagina
                        de Ordenes.
                      </p>
                      <button
                        onClick={() => setPaymentSuccess(false)}
                        className="mt-4 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        OK
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
