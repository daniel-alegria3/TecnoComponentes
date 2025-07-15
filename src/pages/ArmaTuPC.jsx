import { Link } from "react-router-dom";
import ResumenFinal from "./ResumenFinal";
import { useState, useEffect } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import BuildStepNavigator from "../components/BuildStepNavigator";
import BuildSummary from "../components/BuildSummary";
import StepContent from "../components/build-pc/StepContent";
import PeripheralsDecision from "../components/build-pc/PeripheralsDecision";
import { useProducts } from "../hooks/useProducts";
import { useProductSelection } from "../hooks/useProductSelection";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useProductFilters } from "../hooks/useProductFilters";

export default function ArmaTuPC() {
  const [showSummary, setShowSummary] = useState(false);
  // Hooks personalizados
  const { filteredProducts, loading, error } = useProducts();
  const selectedProducts = useProductSelection();
  const navigation = useStepNavigation();
  const filters = useProductFilters();

  useEffect(() => {
    if (navigation.currentStep === 6) {
      setShowSummary(true);
    } else if (showSummary) {
      // Si el paso cambia y no es 6, oculta el resumen
      setShowSummary(false);
    }
  }, [navigation.currentStep, showSummary]);

  // Agregar función canGoToNextMainStep al objeto navigation
  const enhancedNavigation = {
    ...navigation,
    canGoToNextMainStep: (step) => navigation.canGoToNextMainStep(step, selectedProducts.canContinue)
  };

  const estimatedTDP = 0; // Se elimina la dependencia de specs.TDP

  const LAST_STEP = 6;

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
        setCurrentStep={(step) => {
          if (showSummary) {
            setShowSummary(false);
          }
          navigation.setCurrentStep(step);
        }}
      />

      {showSummary ? (
        <ResumenFinal
          selectedProducts={selectedProducts}
          setShowSummary={setShowSummary}
          goToStep={(step) => {
            if (showSummary) setShowSummary(false);
            navigation.setCurrentStep(step);
          }}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 flex">
          <main className="flex-1 pr-8">
            {/* Mostrar pantalla de decisión de periféricos */}
            {navigation.showPeripheralsDecision() ? (
              <PeripheralsDecision
                onAddPeripherals={navigation.goToPeripherals}
                onSkipToSummary={() => {
                  navigation.skipToSummary();
                  setShowSummary(true);
                }}
                totalPrice={selectedProducts.totalPrice}
              />
            ) : (
              /* Mostrar contenido normal de pasos (oculto en el resumen final) */
              navigation.currentStep !== 6 && (
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
              )
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
            selectedMonitor={selectedProducts.selectedMonitor}
            selectedKeyboard={selectedProducts.selectedKeyboard}
            selectedMouse={selectedProducts.selectedMouse}
            selectedHeadphones={selectedProducts.selectedHeadphones}
            selectedSpeakers={selectedProducts.selectedSpeakers}
            selectedWebcam={selectedProducts.selectedWebcam}
            totalPrice={selectedProducts.totalPrice}
            totalPriceWithPeripherals={selectedProducts.totalPriceWithPeripherals}
            estimatedTDP={estimatedTDP}
            onNextStep={navigation.handleNextStep}
            canContinue={selectedProducts.canContinue(navigation.currentStep)}
            showPeripheralsDecision={navigation.showPeripheralsDecision()}
          />
        </div>
      )}
    </div>
  );
}