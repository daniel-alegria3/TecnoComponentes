import { useState } from "react";
import { INITIAL_STEPS, INITIAL_SUB_STEPS } from "../constants/buildSteps";

export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [currentSubStep, setCurrentSubStep] = useState(INITIAL_SUB_STEPS);
  const [steps, setSteps] = useState(INITIAL_STEPS);

  // Avanzar al siguiente paso principal
  const handleNextStep = () => {
    const newSteps = steps.map((step) => {
      if (step.id === currentStep) {
        return { ...step, status: "complete" };
      }
      if (step.id === currentStep + 1) {
        return { ...step, status: "current" };
      }
      return step;
    });
    
    setSteps(newSteps);
    setCurrentStep(currentStep + 1);
    // Resetear sub-paso al avanzar al siguiente paso principal
    setCurrentSubStep(prev => ({ ...prev, [currentStep + 1]: 1 }));
  };

  // Avanzar al siguiente sub-paso
  const handleNextSubStep = (step) => {
    setCurrentSubStep(prev => ({ 
      ...prev, 
      [step]: Math.min(prev[step] + 1, 2) 
    }));
  };

  // Retroceder al sub-paso anterior
  const handlePrevSubStep = (step) => {
    const currentSub = currentSubStep[step];
    
    // Si estamos en el primer sub-paso, ir al paso anterior
    if (currentSub === 1 && step > 2) {
      const prevStep = step - 1;
      setCurrentStep(prevStep);
      setCurrentSubStep(prev => ({ ...prev, [prevStep]: 2 })); // Ir al último sub-paso del paso anterior
      
      // Actualizar el estado de los pasos
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
    return current > 1 || step > 2;
  };

  return {
    currentStep,
    currentSubStep,
    steps,
    setCurrentStep,
    handleNextStep,
    handleNextSubStep,
    handlePrevSubStep,
    canGoToNextMainStep,
    canGoBack,
  };
};
