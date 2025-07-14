import { useState } from "react";

export const useProductSelection = () => {
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedPSU, setSelectedPSU] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCooler, setSelectedCooler] = useState(null);
  
  // Periféricos opcionales
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [selectedKeyboard, setSelectedKeyboard] = useState(null);
  const [selectedMouse, setSelectedMouse] = useState(null);
  const [selectedHeadphones, setSelectedHeadphones] = useState(null);
  const [selectedSpeakers, setSelectedSpeakers] = useState(null);
  const [selectedWebcam, setSelectedWebcam] = useState(null);

  // Handlers para selección de productos
  const handleSelectCPU = (cpu) => setSelectedCPU(cpu);
  const handleSelectMotherboard = (motherboard) => setSelectedMotherboard(motherboard);
  const handleSelectRAM = (ram) => setSelectedRAM(ram);
  const handleSelectGPU = (gpu) => setSelectedGPU(gpu);
  const handleSelectStorage = (storage) => setSelectedStorage(storage);
  const handleSelectPSU = (psu) => setSelectedPSU(psu);
  const handleSelectCase = (caseItem) => setSelectedCase(caseItem);
  const handleSelectCooler = (cooler) => setSelectedCooler(cooler);
  
  // Handlers para periféricos
  const handleSelectMonitor = (monitor) => setSelectedMonitor(monitor);
  const handleSelectKeyboard = (keyboard) => setSelectedKeyboard(keyboard);
  const handleSelectMouse = (mouse) => setSelectedMouse(mouse);
  const handleSelectHeadphones = (headphones) => setSelectedHeadphones(headphones);
  const handleSelectSpeakers = (speakers) => setSelectedSpeakers(speakers);
  const handleSelectWebcam = (webcam) => setSelectedWebcam(webcam);

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
      monitor: handleSelectMonitor,
      keyboard: handleSelectKeyboard,
      mouse: handleSelectMouse,
      headphones: handleSelectHeadphones,
      speakers: handleSelectSpeakers,
      webcam: handleSelectWebcam,
    };
    
    const handler = handlers[productType];
    if (handler) {
      handler(product);
    }
  };

  // Obtener producto seleccionado por tipo
  const getSelectedProduct = (productType) => {
    const products = {
      cpu: selectedCPU,
      motherboard: selectedMotherboard,
      ram: selectedRAM,
      gpu: selectedGPU,
      storage: selectedStorage,
      psu: selectedPSU,
      case: selectedCase,
      cooler: selectedCooler,
      monitor: selectedMonitor,
      keyboard: selectedKeyboard,
      mouse: selectedMouse,
      headphones: selectedHeadphones,
      speakers: selectedSpeakers,
      webcam: selectedWebcam,
    };
    
    return products[productType];
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

  // Calcular precio total con periféricos
  const totalPriceWithPeripherals = (
    totalPrice +
    parseFloat(selectedMonitor?.price || 0) +
    parseFloat(selectedKeyboard?.price || 0) +
    parseFloat(selectedMouse?.price || 0) +
    parseFloat(selectedHeadphones?.price || 0) +
    parseFloat(selectedSpeakers?.price || 0) +
    parseFloat(selectedWebcam?.price || 0)
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
      case 5.5:
        // Los periféricos son opcionales, siempre se puede continuar
        return true;
      default:
        return false;
    }
  };

  return {
    // Productos seleccionados
    selectedCPU,
    selectedMotherboard,
    selectedRAM,
    selectedGPU,
    selectedStorage,
    selectedPSU,
    selectedCase,
    selectedCooler,
    
    // Periféricos seleccionados
    selectedMonitor,
    selectedKeyboard,
    selectedMouse,
    selectedHeadphones,
    selectedSpeakers,
    selectedWebcam,
    
    // Handlers individuales
    handleSelectCPU,
    handleSelectMotherboard,
    handleSelectRAM,
    handleSelectGPU,
    handleSelectStorage,
    handleSelectPSU,
    handleSelectCase,
    handleSelectCooler,
    
    // Handlers de periféricos
    handleSelectMonitor,
    handleSelectKeyboard,
    handleSelectMouse,
    handleSelectHeadphones,
    handleSelectSpeakers,
    handleSelectWebcam,
    
    // Funciones utilitarias
    handleSelectProduct,
    getSelectedProduct,
    totalPrice,
    totalPriceWithPeripherals,
    canContinue,
  };
};
