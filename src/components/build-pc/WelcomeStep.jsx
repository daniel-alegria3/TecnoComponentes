import { Link } from "react-router-dom";
import { ArrowRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function WelcomeStep({ onContinue }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl mb-6">
          <svg 
            className="w-10 h-10 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" 
            />
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          ¡Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Arma tu PC</span>!
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Te guiaremos paso a paso para construir la computadora perfecta según tus necesidades y presupuesto. 
          Es fácil, rápido y completamente personalizable.
        </p>
      </div>

      {/* Process Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          ¿Cómo funciona nuestro proceso?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona Componentes</h3>
            <p className="text-gray-600">
              Elige CPU, placa base, RAM, tarjeta gráfica y más componentes esenciales para tu build.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-2xl mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Añade Periféricos</h3>
            <p className="text-gray-600">
              Completa tu setup con monitor, teclado, mouse y otros periféricos opcionales.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revisa y Compra</h3>
            <p className="text-gray-600">
              Verifica la compatibilidad, revisa el precio total y añade todo al carrito.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Verificación de Compatibilidad</h3>
          </div>
          <p className="text-gray-600">
            Nuestro sistema automáticamente verifica que todos los componentes sean compatibles entre sí.
          </p>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Presupuesto en Tiempo Real</h3>
          </div>
          <p className="text-gray-600">
            Ve el precio total actualizándose mientras seleccionas cada componente.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onContinue}
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="mr-2">Comenzar a Armar</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
        
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12 p-6 bg-gray-50 rounded-xl">
        <p className="text-gray-600">
          💡 <span className="font-medium">Consejo:</span> Puedes guardar tu progreso en cualquier momento y continuar más tarde.
        </p>
      </div>
    </div>
  );
}
