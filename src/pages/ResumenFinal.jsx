import { Link, useNavigate } from "react-router-dom";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import BuildSummary from "../components/BuildSummary";
import { useCart } from "../context/CartContext";

export default function ResumenFinal({ selectedProducts, setShowSummary, goToStep }) {
  const estimatedTDP = 0;
  const navigate = useNavigate();
  const { addProdToCart } = useCart();

  // Añadir todos los productos, incluyendo periféricos, al carrito
  const handleAddAllToCart = async () => {
    const productos = [
      selectedProducts.selectedCPU,
      selectedProducts.selectedMotherboard,
      selectedProducts.selectedRAM,
      selectedProducts.selectedGPU,
      selectedProducts.selectedStorage,
      selectedProducts.selectedPSU,
      selectedProducts.selectedCase,
      selectedProducts.selectedCooler,
      selectedProducts.selectedMonitor,
      selectedProducts.selectedKeyboard,
      selectedProducts.selectedMouse,
      selectedProducts.selectedHeadphones,
      selectedProducts.selectedSpeakers,
      selectedProducts.selectedWebcam
    ].filter(Boolean);

    for (const prod of productos) {
      await addProdToCart(prod);
    }
    navigate('/cart');
  };

  const handleBack = () => {
    // Vuelve al paso de periféricos (5.5) o al paso 5 si es necesario
    if (typeof goToStep === 'function') {
      goToStep(5.5);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-monofur">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Columna Izquierda: Resumen del Build (ocupa 2/3) */}
          <div className="lg:col-span-2 w-full">
            <BuildSummary
              selectedCPU={selectedProducts.selectedCPU}
              selectedMotherboard={selectedProducts.selectedMotherboard}
              selectedRAM={selectedProducts.selectedRAM}
              selectedGPU={selectedProducts.selectedGPU}
              selectedStorage={selectedProducts.selectedStorage}
              selectedPSU={selectedProducts.selectedPSU}
              selectedCase={selectedProducts.selectedCase}
              selectedCooler={selectedProducts.selectedCooler}
              selectedMonitor={selectedProducts.selectedMonitor}
              selectedKeyboard={selectedProducts.selectedKeyboard}
              selectedMouse={selectedProducts.selectedMouse}
              selectedHeadphones={selectedProducts.selectedHeadphones}
              selectedSpeakers={selectedProducts.selectedSpeakers}
              selectedWebcam={selectedProducts.selectedWebcam}
              totalPrice={selectedProducts.totalPrice}
              totalPriceWithPeripherals={selectedProducts.totalPriceWithPeripherals}
              estimatedTDP={estimatedTDP}
              onNextStep={() => {}}
              canContinue={false}
              showPeripheralsDecision={false}
              expanded={true}
              colorOverride={{
                border: "border-transparent",
                bg: "bg-transparent",
                iconBg: "bg-transparent",
                icon: "text-blue-600 font-bold",
                label: "text-violet-700 font-bold",
                plus: "text-blue-500 font-bold"
              }}
            />
          </div>

          {/* Columna Derecha: Panel de Acciones (ocupa 1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full border border-gray-300 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Compatibilidad</h2>
              <div className="w-full mb-4">
                <div className="w-full h-6 bg-gray-100 rounded-lg border border-gray-400 flex items-center relative">
                  <div className="h-full bg-blue-500 rounded-lg" style={{ width: '85%' }}></div>
                  <span className="absolute w-full text-center text-sm font-semibold text-white" style={{ left: 0, top: 0, lineHeight: '1.5rem' }}>85%</span>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${selectedProducts.totalPriceWithPeripherals.toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg mb-3 shadow hover:bg-blue-700 transition-colors font-normal"
                onClick={handleAddAllToCart}
              >
                Añadir al carrito
              </button>
              <button
                className="w-full bg-orange-500 text-white py-2 rounded-lg text-lg shadow hover:bg-orange-600 transition-colors mt-2 font-normal"
                onClick={handleBack}
              >
                « Volver atrás
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}