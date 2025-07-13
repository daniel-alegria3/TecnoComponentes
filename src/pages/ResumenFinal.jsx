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
          className="flex items-center mb-8 px-4 py-2 rounded-lg transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
          onClick={handleBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Paso Anterior
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


