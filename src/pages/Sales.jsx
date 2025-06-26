import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "../context/SessionContext";

import {
  CreditCardIcon,
  TruckIcon,
  HomeIcon,
  BuildingStorefrontIcon
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import useProductImages from '../composables/useProductImages';


export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { isLoggedIn } = useSession();

  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [metodoEntrega, setMetodoEntrega] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce( (sum, item) => sum + item.product.price * item.quantity, 0);
  const entrega = 0.0;
  const total = subtotal + entrega;

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePagar = async () => {
    if (!metodoPago || !metodoEntrega) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    // Simular procesamiento de pago
    setTimeout(() => {
      // alert("¡Pago procesado exitosamente!");
      setLoading(false);
    }, 2000);
    setPaymentSuccess(true);
  };

  function SalesItem({ product, quantity }) {
    const { imageUrls, isLoading: isImagesLoading } = useProductImages(product?.images_path || []);

    if (!isLoggedIn) {
      return (
        <div>
          <h2>Iniciar session para ver la pagina de Venta</h2>
        </div>
      )
    }
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
          <div className="text-sm font-medium">${parseFloat(product.price).toFixed(2)}</div>
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
              <h2 className="text-lg font-semibold mb-4">Dirección de entrega</h2>
              <div className="space-y-4">
                <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-md border">
                  RECUPERADA DE LA BD
                </p>
              </div>
            </div>

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
                    <span>Tarjeta de débito/crédito</span>
                  </div>
                  {metodoPago === "tarjeta" && (
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
                      Cambiar
                    </button>
                  )}
                </label>
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
                    <div className="h-5 w-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">Y</div>
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
                {cartItems.map(({product, quantity}) => (
                  <SalesItem
                    product={product}
                    quantity={quantity}
                  />
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
                  <span className="text-gray-600">Productos ({cartItems.length})</span>
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
                          Gracias por su preferencia. Revise su orden su la pagina de Ordenes.
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
