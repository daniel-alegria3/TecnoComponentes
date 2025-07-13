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

      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex space-x-4 mb-8 mt-8">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow"
            onClick={handleBack}
          >
            ← Volver atrás
          </button>
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow"
            type="button"
          >
            boton que no hace nada
          </button>
        </div>
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
        />
      </div>
    </div>
  );
}


