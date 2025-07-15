import { useState } from "react";
import { INITIAL_STEPS, INITIAL_SUB_STEPS } from "../constants/buildSteps";

export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [currentSubStep, setCurrentSubStep] = useState(INITIAL_SUB_STEPS);
  const [steps, setSteps] = useState(INITIAL_STEPS);

  // Avanzar al siguiente paso principal
  const handleNextStep = () => {
    const isLastComponentStep = currentStep === 5;
    const isLastPeripheralStep = currentStep === 5.5 && currentSubStep[5.5] === 6;

    let nextStepId;

    if (isLastComponentStep) {
      // Al completar el paso 5, no cambiamos de número de paso todavía.
      // Simplemente lo marcamos como completo para que se muestre la pantalla de decisión de periféricos.
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

    const newSteps = steps.map((step) => {
      if (step.id === currentStep) {
        return { ...step, status: "complete" };
      }
      if (step.id === nextStepId) {
        return { ...step, status: "current" };
      }
      return step;
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
    if (currentSub === 1 && step > 2) {
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
    return current > 1 || step > 2;
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
    setCurrentStep,
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
