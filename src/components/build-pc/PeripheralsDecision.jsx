import { 
  ComputerDesktopIcon, 
  ArrowRightIcon, 
  PlusIcon,
  CheckIcon 
} from "@heroicons/react/24/outline";

export default function PeripheralsDecision({ 
  onAddPeripherals, 
  onSkipToSummary,
  totalPrice 
}) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <CheckIcon className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          ¡PC Base Completada! 🎉
        </h2>
        <p className="text-lg text-gray-600">
          Tu build está lista. ¿Quieres agregar periféricos para completar tu setup?
        </p>
      </div>

      {/* Build Summary Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Tu Build Actual</h3>
          <div className="text-2xl font-bold text-green-600">
            ${totalPrice.toFixed(2)}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl mb-1">🖥️</div>
            <div className="text-sm text-gray-600">CPU & Placa</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl mb-1">💾</div>
            <div className="text-sm text-gray-600">RAM & GPU</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-2xl mb-1">💿</div>
            <div className="text-sm text-gray-600">Almacenamiento</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl mb-1">📦</div>
            <div className="text-sm text-gray-600">Gabinete</div>
          </div>
        </div>
      </div>

      {/* Decision Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Option 1: Add Peripherals */}
        <div 
          onClick={onAddPeripherals}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <ComputerDesktopIcon className="h-8 w-8" />
            </div>
            <PlusIcon className="h-6 w-6" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">Agregar Periféricos</h3>
          <p className="text-indigo-100 mb-4">
            Completa tu setup con monitor, teclado, mouse y más
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-indigo-100">
              <div className="w-2 h-2 bg-indigo-300 rounded-full mr-2"></div>
              Monitor y pantallas
            </div>
            <div className="flex items-center text-sm text-indigo-100">
              <div className="w-2 h-2 bg-indigo-300 rounded-full mr-2"></div>
              Teclado y mouse
            </div>
            <div className="flex items-center text-sm text-indigo-100">
              <div className="w-2 h-2 bg-indigo-300 rounded-full mr-2"></div>
              Auriculares y altavoces
            </div>
            <div className="flex items-center text-sm text-indigo-100">
              <div className="w-2 h-2 bg-indigo-300 rounded-full mr-2"></div>
              Webcam y accesorios
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-indigo-100">Opcional</span>
            <ArrowRightIcon className="h-5 w-5" />
          </div>
        </div>

        {/* Option 2: Skip to Summary */}
        <div 
          onClick={onSkipToSummary}
          className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <ArrowRightIcon className="h-6 w-6 text-gray-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ir al Resumen</h3>
          <p className="text-gray-600 mb-4">
            Mi PC está completa, quiero ver el resumen final
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Ver resumen completo
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Agregar al carrito
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Finalizar build
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Recomendado</span>
            <div className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
              Listo
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center mt-8 text-gray-500">
        <p className="text-sm">
          💡 <strong>Tip:</strong> Puedes agregar periféricos más tarde desde tu carrito
        </p>
      </div>
    </div>
  );
}
