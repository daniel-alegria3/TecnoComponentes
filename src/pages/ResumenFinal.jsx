import { Link, useNavigate } from "react-router-dom";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import BuildStepNavigator from "../components/BuildStepNavigator";
import BuildSummary from "../components/BuildSummary";


import { useProductSelection } from "../context/ProductSelectionContext";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useCart } from "../context/CartContext";

export default function ResumenFinal({ setShowSummary, goToStep }) {
  const selectedProducts = useProductSelection();
  const navigation = useStepNavigation();
  const estimatedTDP = 0;
  const navigate = useNavigate();
  const { addProdToCart } = useCart();
  // Añadir todos los productos seleccionados al carrito y redirigir
  const handleAddAllToCart = async () => {
    const productos = [
      selectedProducts.selectedCPU,
      selectedProducts.selectedMotherboard,
      selectedProducts.selectedRAM,
      selectedProducts.selectedGPU,
      selectedProducts.selectedStorage,
      selectedProducts.selectedPSU,
      selectedProducts.selectedCase,
      selectedProducts.selectedCooler
    ].filter(Boolean);
    for (const prod of productos) {
      await addProdToCart(prod);
    }
    navigate('/cart');
  };

  const handleBack = () => {
    // Ejecutar exactamente la misma lógica que al hacer click en el paso 5 de la barra de navegación
    if (typeof goToStep === 'function') {
      goToStep(5);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-monofur">
      {/* Header eliminado para evitar duplicidad con el de ArmaTuPC */}

      {/* Steps Navigation - solo mostrar una barra de estado */}
      {/* La barra de estado ya se muestra desde ArmaTuPC.jsx, así que aquí la eliminamos para evitar duplicados */}

      <div className="flex flex-col items-center justify-center min-h-[70vh] sm:flex-row sm:items-start sm:justify-center">
        {/* TuBuild grande a la izquierda, alineado arriba */}
        <div className="flex-1 flex flex-col items-start" style={{ marginLeft: 150, maxWidth: 'calc(100% + 100px)' }}>
          <div className="mb-8" />
          <div className="w-full" style={{ maxWidth: 'calc(100% + 100px)' }}>
            <div className="max-w-screen-xl mx-auto" style={{ maxWidth: 'calc(100% + 100px)' }}>
              <BuildSummary
                selectedCPU={selectedProducts.selectedCPU}
                selectedMotherboard={selectedProducts.selectedMotherboard}
                selectedRAM={selectedProducts.selectedRAM}
                selectedGPU={selectedProducts.selectedGPU}
                selectedStorage={selectedProducts.selectedStorage}
                selectedPSU={selectedProducts.selectedPSU}
                selectedCase={selectedProducts.selectedCase}
                selectedCooler={selectedProducts.selectedCooler}
                totalPrice={selectedProducts.totalPrice}
                estimatedTDP={estimatedTDP}
                onNextStep={() => {}}
                canContinue={false}
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
          </div>
          {/* Espacio prudente después de TuBuild antes del footer */}
          <div style={{ height: 64 }} />
        </div>
        {/* Panel de compatibilidad fijo a la derecha */}
        <div className="sm:w-1/4 w-full mt-8 sm:mt-0 sm:ml-8 flex flex-col items-center" style={{ marginRight: 150 }}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs border border-gray-300 mt-8">
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
              <span className="text-lg font-bold">${selectedProducts.totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg mb-3 shadow hover:bg-blue-700 transition-colors font-bold"
              onClick={handleAddAllToCart}
            >
              Añadir al carrito
            </button>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg mb-3 shadow hover:bg-blue-700 transition-colors font-normal">
              Comprar
            </button>
            <button
              className="w-full bg-orange-500 text-white py-2 rounded-lg text-lg shadow hover:bg-orange-600 transition-colors mt-2 font-normal"
              onClick={handleBack}
            >
              ← Volver atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


