import { Link, useNavigate } from "react-router-dom";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import BuildStepNavigator from "../components/BuildStepNavigator";
import BuildSummary from "../components/BuildSummary";


import { useProductSelection } from "../context/ProductSelectionContext";
import { useStepNavigation } from "../hooks/useStepNavigation";

export default function ResumenFinal() {
  const selectedProducts = useProductSelection();
  const navigation = useStepNavigation();
  const estimatedTDP = 0;
  const navigate = useNavigate();

  const handleBack = () => {
    navigation.setCurrentStep(5);
    navigation.setCurrentSubStep && navigation.setCurrentSubStep(prev => ({ ...prev, 5: 2 }));
    navigate("/arma-tu-pc");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-monofur">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Tecno<span className="text-violet-500">Componentes</span>
            </Link>
            <span className="mx-2 text-gray-400 font-light">/</span>
            <h1 className="text-gray-600">Arma tu PC</h1>
          </div>
          <div className="flex space-x-4">
            <button type="button" className="text-gray-600 hover:text-gray-800">
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Steps Navigation */}
      <BuildStepNavigator
        steps={navigation.steps}
        currentStep={navigation.currentStep}
        setCurrentStep={navigation.setCurrentStep}
      />

      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <button
          className="mb-8 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-semibold shadow"
          onClick={handleBack}
        >
          ← Volver al paso anterior
        </button>
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


