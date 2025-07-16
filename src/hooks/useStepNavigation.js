import { useState } from "react";
import { INITIAL_STEPS, INITIAL_SUB_STEPS } from "../constants/buildSteps";

export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSubStep, setCurrentSubStep] = useState(INITIAL_SUB_STEPS);
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [completedSteps, setCompletedSteps] = useState(new Set()); // Track completed steps

  // Función para verificar si un paso está completado
  const isStepCompleted = (stepId, selectedProducts) => {
    switch (stepId) {
      case 1:
        return true; // El paso de inicio siempre se considera completado una vez que sales de él
      case 2:
        return selectedProducts?.selectedCPU && selectedProducts?.selectedMotherboard;
      case 3:
        return selectedProducts?.selectedRAM && selectedProducts?.selectedGPU;
      case 4:
        return selectedProducts?.selectedStorage && selectedProducts?.selectedPSU;
      case 5:
        return selectedProducts?.selectedCase && selectedProducts?.selectedCooler;
      case 5.5:
        return true; // Los periféricos son opcionales
      default:
        return false;
    }
  };

  // Función para navegar directamente a un paso
  const navigateToStep = (targetStep, selectedProducts) => {
    // Verificar qué pasos están completados hasta el paso objetivo
    const newCompletedSteps = new Set();
    for (let i = 1; i <= 6; i++) { // Revisamos todos los pasos posibles
      if (isStepCompleted(i, selectedProducts)) {
        newCompletedSteps.add(i);
      }
    }
    
    // Solo permitir navegación si todos los pasos anteriores están completados
    const canNavigate = Array.from({ length: targetStep - 1 }, (_, i) => i + 1)
      .every(step => isStepCompleted(step, selectedProducts));
    
    if (!canNavigate && targetStep > currentStep) {
      return false; // No se puede saltar a un paso sin completar los anteriores
    }

    setCompletedSteps(newCompletedSteps);
    
    // Actualizar el estado visual de los pasos
    const newSteps = steps.map((step) => {
      if (step.id === targetStep) {
        // El paso actual puede estar completado pero sigue siendo "current"
        return { ...step, status: "current" };
      }
      if (newCompletedSteps.has(step.id) && step.id !== targetStep) {
        // Los pasos completados que NO son el actual mantienen su estado "complete"
        return { ...step, status: "complete" };
      }
      return { ...step, status: "upcoming" };
    });

    setSteps(newSteps);
    setCurrentStep(targetStep);

    // Restaurar el sub-paso apropiado
    if (INITIAL_SUB_STEPS[targetStep]) {
      // Si es un paso ya completado, ir al último sub-paso
      if (newCompletedSteps.has(targetStep)) {
        const maxSubSteps = targetStep === 5.5 ? 6 : 2;
        setCurrentSubStep(prev => ({ ...prev, [targetStep]: maxSubSteps }));
      } else {
        // Si no está completado, ir al primer sub-paso
        setCurrentSubStep(prev => ({ ...prev, [targetStep]: 1 }));
      }
    }
    
    return true;
  };

  // Avanzar al siguiente paso principal
  const handleNextStep = (selectedProducts) => {
    const isLastComponentStep = currentStep === 5;
    const isLastPeripheralStep = currentStep === 5.5 && currentSubStep[5.5] === 6;

    let nextStepId;

    if (currentStep === 1) {
      nextStepId = 2; // Del paso de inicio (1) al primer paso de componentes (2)
    } else if (isLastComponentStep) {
      // Al completar el paso 5, marcar como completo y actualizar completed steps
      setCompletedSteps(prev => new Set([...prev, 5]));
      const newSteps = steps.map(s => s.id === 5 ? { ...s, status: 'complete' } : s);
      setSteps(newSteps);
      return; // Salimos para no cambiar el número de paso actual.
    } else if (isLastPeripheralStep) {
      nextStepId = 6; // Si es el último periférico, vamos al resumen (paso 6).
    } else if (currentStep < 5) {
      nextStepId = currentStep + 1; // Progresión normal para los pasos 2, 3, 4.
    } else {
      // Si estamos en medio de los periféricos (5.5), el botón principal "Siguiente" no debería hacer nada.
      // La navegación se controla con los botones de sub-paso.
      return;
    }

    if (!nextStepId) return;

    // Actualizar completed steps
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    // Actualizar el estado visual conservando pasos completados
    const newCompletedSteps = new Set([...completedSteps, currentStep]);
    const newSteps = steps.map((step) => {
      if (step.id === nextStepId) {
        return { ...step, status: "current" };
      }
      if (newCompletedSteps.has(step.id)) {
        return { ...step, status: "complete" };
      }
      return { ...step, status: "upcoming" };
    });

    setSteps(newSteps);
    setCurrentStep(nextStepId);

    // Si el nuevo paso tiene sub-pasos, inicializamos en el primero.
    if (INITIAL_SUB_STEPS[nextStepId]) {
      setCurrentSubStep(prev => ({ ...prev, [nextStepId]: 1 }));
    }
  };

  // Avanzar al siguiente sub-paso
  const handleNextSubStep = (step) => {
    const maxSubSteps = step === 5.5 ? 6 : 2; // Paso 5.5 ahora tiene 6 sub-pasos
    setCurrentSubStep(prev => ({ 
      ...prev, 
      [step]: Math.min(prev[step] + 1, maxSubSteps) 
    }));
  };

  // Retroceder al sub-paso anterior
  const handlePrevSubStep = (step) => {
    const currentSub = currentSubStep[step];

    // Si estamos en el primer sub-paso de Periféricos (5.5), ir al último sub-paso del paso 5
    if (step === 5.5 && currentSub === 1) {
      setCurrentStep(5);
      setCurrentSubStep(prev => ({ ...prev, 5: 2 })); // Ir al último sub-paso del paso 5 (Refrigeración)
      setSteps(prevSteps => prevSteps.map((s) => {
        if (s.id === 5.5) {
          return { ...s, status: "upcoming" };
        }
        if (s.id === 5) {
          return { ...s, status: "current" };
        }
        return s;
      }));
      return;
    }

    // Si estamos en el primer sub-paso, ir al paso anterior (comportamiento estándar)
    if (currentSub === 1 && step > 1) {
      const prevStep = step - 1;
      // Si el paso anterior es 5.5 (periféricos), ir a su último sub-paso
      if (prevStep === 5.5) {
        setCurrentStep(5.5);
        setCurrentSubStep(prev => ({ ...prev, 5.5: 6 }));
        setSteps(prevSteps => prevSteps.map((s) => {
          if (s.id === step) {
            return { ...s, status: "upcoming" };
          }
          if (s.id === 5.5) {
            return { ...s, status: "current" };
          }
          return s;
        }));
        return;
      }
      // Si vamos al paso 1 (inicio), no tiene sub-pasos
      if (prevStep === 1) {
        setCurrentStep(1);
        setSteps(prevSteps => prevSteps.map((s) => {
          if (s.id === step) {
            return { ...s, status: "upcoming" };
          }
          if (s.id === 1) {
            return { ...s, status: "current" };
          }
          return s;
        }));
        return;
      }
      // Comportamiento estándar para otros pasos
      setCurrentStep(prevStep);
      setCurrentSubStep(prev => ({ ...prev, [prevStep]: 2 })); // Ir al último sub-paso del paso anterior
      setSteps(prevSteps => prevSteps.map((s) => {
        if (s.id === step) {
          return { ...s, status: "upcoming" };
        }
        if (s.id === prevStep) {
          return { ...s, status: "current" };
        }
        return s;
      }));
    } else {
      // Navegación normal entre sub-pasos
      setCurrentSubStep(prev => ({ 
        ...prev, 
        [step]: Math.max(prev[step] - 1, 1) 
      }));
    }
  };

  // Verificar si se puede avanzar al siguiente paso principal
  const canGoToNextMainStep = (step, canContinue) => {
    return canContinue(step);
  };

  // Determinar si se puede retroceder
  const canGoBack = (step) => {
    const current = currentSubStep[step];
    return current > 1 || step > 1;
  };

  // Ir al paso de periféricos (opcional)
  const goToPeripherals = () => {
    const newSteps = steps.map((step) => {
      // El paso 5 ya debería estar 'complete' por handleNextStep.
      // Marcamos el 5.5 como 'current'.
      if (step.id === 5.5) {
        return { ...step, status: "current" };
      }
      return step;
    });
    setSteps(newSteps);
    setCurrentStep(5.5);
    setCurrentSubStep(prev => ({ ...prev, 5.5: 1 }));
  };

  // Saltar directamente al resumen final
  const skipToSummary = () => {
    const newSteps = steps.map((step) => {
      if (step.id === 5) {
        return { ...step, status: "complete" };
      }
      if (step.id === 6) {
        return { ...step, status: "current" };
      }
      return step;
    });
    setSteps(newSteps);
    setCurrentStep(6); // Ir directamente al paso 6
  };

  // Determina si se debe mostrar la pantalla de decisión de periféricos.
  const showPeripheralsDecision = () => {
    const step5 = steps.find(s => s.id === 5);
    // Se muestra si el paso 5 está 'complete' pero seguimos lógicamente en el paso 5 (aún no hemos elegido periféricos o resumen).
    return currentStep === 5 && step5 && step5.status === 'complete';
  };

  return {
    currentStep,
    currentSubStep,
    steps,
    completedSteps,
    setCurrentStep,
    navigateToStep,
    isStepCompleted,
    handleNextStep,
    handleNextSubStep,
    handlePrevSubStep,
    canGoToNextMainStep,
    canGoBack,
    goToPeripherals,
    skipToSummary,
    showPeripheralsDecision
  };
};
