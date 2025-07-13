import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const ProductSelectionContext = createContext();

export function ProductSelectionProvider({ children }) {
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedPSU, setSelectedPSU] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCooler, setSelectedCooler] = useState(null);

  // Handlers para selección de productos
  const handleSelectCPU = (cpu) => setSelectedCPU(cpu);
  const handleSelectMotherboard = (motherboard) => setSelectedMotherboard(motherboard);
  const handleSelectRAM = (ram) => setSelectedRAM(ram);
  const handleSelectGPU = (gpu) => setSelectedGPU(gpu);
  const handleSelectStorage = (storage) => setSelectedStorage(storage);
  const handleSelectPSU = (psu) => setSelectedPSU(psu);
  const handleSelectCase = (caseItem) => setSelectedCase(caseItem);
  const handleSelectCooler = (cooler) => setSelectedCooler(cooler);

  // Función genérica para seleccionar productos
  const handleSelectProduct = (productType, product) => {
    const handlers = {
      cpu: handleSelectCPU,
      motherboard: handleSelectMotherboard,
      ram: handleSelectRAM,
      gpu: handleSelectGPU,
      storage: handleSelectStorage,
      psu: handleSelectPSU,
      case: handleSelectCase,
      cooler: handleSelectCooler,
    };
    const handler = handlers[productType];
    if (handler) handler(product);
  };

  // Calcular precio total
  const totalPrice = (
    parseFloat(selectedCPU?.price || 0) +
    parseFloat(selectedMotherboard?.price || 0) +
    parseFloat(selectedRAM?.price || 0) +
    parseFloat(selectedGPU?.price || 0) +
    parseFloat(selectedStorage?.price || 0) +
    parseFloat(selectedPSU?.price || 0) +
    parseFloat(selectedCase?.price || 0) +
    parseFloat(selectedCooler?.price || 0)
  );

  // Verificar si se puede continuar con el paso actual
  const canContinue = (currentStep) => {
    switch (currentStep) {
      case 2:
        return selectedCPU && selectedMotherboard;
      case 3:
        return selectedRAM && selectedGPU;
      case 4:
        return selectedStorage && selectedPSU;
      case 5:
        return selectedCase && selectedCooler;
      default:
        return false;
    }
  };

  return (
    <ProductSelectionContext.Provider
      value={{
        selectedCPU,
        selectedMotherboard,
        selectedRAM,
        selectedGPU,
        selectedStorage,
        selectedPSU,
        selectedCase,
        selectedCooler,
        handleSelectCPU,
        handleSelectMotherboard,
        handleSelectRAM,
        handleSelectGPU,
        handleSelectStorage,
        handleSelectPSU,
        handleSelectCase,
        handleSelectCooler,
        handleSelectProduct,
        totalPrice,
        canContinue,
      }}
    >
      {children}
    </ProductSelectionContext.Provider>
  );
}

ProductSelectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useProductSelection() {
  return useContext(ProductSelectionContext);
}
