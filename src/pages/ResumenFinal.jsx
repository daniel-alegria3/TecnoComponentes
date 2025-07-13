import { Link, useNavigate } from "react-router-dom";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import BuildStepNavigator from "../components/BuildStepNavigator";
import BuildSummary from "../components/BuildSummary";


import { useProductSelection } from "../context/ProductSelectionContext";
import { useStepNavigation } from "../hooks/useStepNavigation";

export default function ResumenFinal({ setShowSummary, goToStep }) {
  const selectedProducts = useProductSelection();
  const navigation = useStepNavigation();
  const estimatedTDP = 0;
  const navigate = useNavigate();

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
        <div className="sm:w-2/3 w-full">
          {/* Separación extra arriba del bloque de compatibilidad */}
          <div className="mb-8 mt-8" />
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
              icon: "text-red-500",
              label: "text-red-500",
              plus: "text-red-500"
            }}
          />
        </div>
        <div className="sm:w-1/3 w-full mt-8 sm:mt-0 sm:ml-8 flex flex-col items-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs border border-gray-300 mt-8">
            <h2 className="text-lg font-bold mb-4">Compatibilidad</h2>
            <div className="w-full mb-4">
              <div className="w-full h-6 bg-gray-100 rounded-lg border border-gray-400 flex items-center">
                <div className="h-full bg-blue-500 rounded-lg" style={{ width: '93%' }}></div>
                <span className="absolute w-full text-center text-sm font-semibold text-gray-800">93%</span>
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">${selectedProducts.totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg mb-3 shadow hover:bg-blue-700 transition-colors">
              Añadir al carrito
            </button>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg mb-3 shadow hover:bg-blue-700 transition-colors">
              Comprar
            </button>
            <button
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-orange-600 transition-colors mt-2"
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


