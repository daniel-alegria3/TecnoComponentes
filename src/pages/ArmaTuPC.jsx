import { Link } from "react-router-dom";
import ResumenFinal from "./ResumenFinal";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import BuildStepNavigator from "../components/BuildStepNavigator";
import BuildSummary from "../components/BuildSummary";
import StepContent from "../components/build-pc/StepContent";
import { useProducts } from "../hooks/useProducts";
import { useProductSelection } from "../context/ProductSelectionContext";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useProductFilters } from "../hooks/useProductFilters";

import { useState } from "react";

export default function ArmaTuPC() {
  const [showSummary, setShowSummary] = useState(false);
  // Hooks personalizados
  const { filteredProducts, loading, error } = useProducts();
  const selectedProducts = useProductSelection();
  const navigation = useStepNavigation();
  const filters = useProductFilters();

  // Agregar función canGoToNextMainStep al objeto navigation
  const enhancedNavigation = {
    ...navigation,
    canGoToNextMainStep: (step) => navigation.canGoToNextMainStep(step, selectedProducts.canContinue)
  };

  const estimatedTDP = 0; // Se elimina la dependencia de specs.TDP

  // Paso final definido en los pasos
  const LAST_STEP = 6;

  // Función para manejar el siguiente paso o redirigir al resumen final
  const handleNextStepOrRedirect = () => {
    if (navigation.currentStep === LAST_STEP - 1) {
      // Marcar el paso 5 (Gabinete & Refrigeración) como completo y el 6 como current
      navigation.setCurrentStep(LAST_STEP);
      if (navigation.steps && navigation.setCurrentStep) {
        // Actualizar el estado visual de los pasos
        navigation.steps.forEach((step, idx) => {
          if (step.id === 5 && step.status !== "complete") {
            step.status = "complete";
          }
          if (step.id === 6) {
            step.status = "current";
          }
        });
      }
      setShowSummary(true);
    } else {
      navigation.handleNextStep();
    }
  };

  const handleBackFromSummary = () => {
    // Volver al paso 5 y marcar el 6 como upcoming
    navigation.setCurrentStep(5);
    navigation.setCurrentSubStep && navigation.setCurrentSubStep(prev => ({ ...prev, 5: 2 }));
    if (navigation.steps && navigation.setCurrentStep) {
      navigation.steps.forEach((step, idx) => {
        if (step.id === 6) {
          step.status = "upcoming";
        }
        if (step.id === 5) {
          step.status = "current";
        }
      });
    }
    setShowSummary(false);
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
            <button type="button" className="text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Steps Navigation */}
      <BuildStepNavigator
        steps={navigation.steps}
        currentStep={showSummary ? LAST_STEP : navigation.currentStep}
        setCurrentStep={navigation.setCurrentStep}
      />

      {showSummary ? (
        <ResumenFinal />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 flex">
          <main className="flex-1 pr-8">
            {[2, 3, 4, 5].includes(navigation.currentStep) && (
              <StepContent
                currentStep={navigation.currentStep}
                currentSubStep={navigation.currentSubStep}
                filteredProducts={filteredProducts}
                selectedProducts={selectedProducts}
                onSelectProduct={selectedProducts.handleSelectProduct}
                filters={filters}
                navigation={enhancedNavigation}
                loading={loading}
                error={error}
              />
            )}
          </main>

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
            onNextStep={handleNextStepOrRedirect}
            canContinue={selectedProducts.canContinue(navigation.currentStep)}
          />
        </div>
      )}
    </div>
  );
}