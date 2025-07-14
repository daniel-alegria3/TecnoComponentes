import StepHeader from "./StepHeader";
import SubStepNavigation from "./SubStepNavigation";
import ProductSelector from "./ProductSelector";
import ProductFilters from "../ProductFilters";

export default function StepContent({ 
  currentStep, 
  currentSubStep, 
  filteredProducts, 
  selectedProducts, 
  onSelectProduct, 
  filters, 
  navigation,
  loading,
  error
}) {
  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  const getProductsForStep = (step, subStep) => {
    const productMap = {
      2: { 1: filteredProducts.cpus, 2: filteredProducts.motherboards },
      3: { 1: filteredProducts.ramModules, 2: filteredProducts.gpus },
      4: { 1: filteredProducts.storageDevices, 2: filteredProducts.psus },
      5: { 1: filteredProducts.cases, 2: filteredProducts.coolers },
      5.5: { 
        1: filteredProducts.monitors, 
        2: filteredProducts.keyboards,
        3: filteredProducts.mice,
        4: filteredProducts.headphones,
        5: filteredProducts.speakers,
        6: filteredProducts.webcams
      }
    };
    return productMap[step]?.[subStep] || [];
  };

  const getProductTypeForStep = (step, subStep) => {
    const typeMap = {
      2: { 1: 'cpu', 2: 'motherboard' },
      3: { 1: 'ram', 2: 'gpu' },
      4: { 1: 'storage', 2: 'psu' },
      5: { 1: 'case', 2: 'cooler' },
      5.5: { 1: 'monitor', 2: 'keyboard', 3: 'mouse', 4: 'headphones', 5: 'speakers', 6: 'webcam' }
    };
    return typeMap[step]?.[subStep] || '';
  };

  const getSelectedProductForStep = (step, subStep) => {
    const selectedMap = {
      2: { 1: selectedProducts.selectedCPU, 2: selectedProducts.selectedMotherboard },
      3: { 1: selectedProducts.selectedRAM, 2: selectedProducts.selectedGPU },
      4: { 1: selectedProducts.selectedStorage, 2: selectedProducts.selectedPSU },
      5: { 1: selectedProducts.selectedCase, 2: selectedProducts.selectedCooler },
      5.5: { 
        1: selectedProducts.selectedMonitor, 
        2: selectedProducts.selectedKeyboard, 
        3: selectedProducts.selectedMouse, 
        4: selectedProducts.selectedHeadphones, 
        5: selectedProducts.selectedSpeakers,
        6: selectedProducts.selectedWebcam
      }
    };
    return selectedMap[step]?.[subStep] || null;
  };

  const currentSub = currentSubStep[currentStep];
  const products = getProductsForStep(currentStep, currentSub);
  const productType = getProductTypeForStep(currentStep, currentSub);
  const selectedProduct = getSelectedProductForStep(currentStep, currentSub);

  return (
    <div>
      <StepHeader step={currentStep} subStep={currentSub} />
      
      <SubStepNavigation 
        currentStep={currentStep}
        currentSubStep={currentSubStep}
        onPrevSubStep={navigation.handlePrevSubStep}
        onNextSubStep={navigation.handleNextSubStep}
        onNextStep={navigation.handleNextStep}
        canGoBack={navigation.canGoBack}
        canGoToNextMainStep={navigation.canGoToNextMainStep}
        maxSubSteps={currentStep === 5.5 ? 6 : 2}
      />
      
      <ProductFilters
        marcas={filters.filterOptions.marcas}
        sockets={filters.filterOptions.sockets}
        nucleosOptions={filters.filterOptions.nucleosOptions}
        priceRange={filters.priceRange}
        onRangeChange={filters.handleRangeChange}
        onLimpiarFiltros={filters.limpiarFiltros}
      />
      
      <ProductSelector
        products={products}
        productType={productType}
        selectedProduct={selectedProduct}
        onSelectProduct={onSelectProduct}
      />
    </div>
  );
}
