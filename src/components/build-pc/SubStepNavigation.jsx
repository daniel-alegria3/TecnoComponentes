import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function SubStepNavigation({
  currentStep,
  currentSubStep,
  onPrevSubStep,
  onNextSubStep,
  onNextStep,
  canGoBack,
  canGoToNextMainStep,
  maxSubSteps = 2
}) {
  const current = currentSubStep[currentStep];
  const isLastSubStep = current === maxSubSteps;
  const canAdvance = canGoToNextMainStep(currentStep);
  const shouldShowNextStep = isLastSubStep && canAdvance;

  // Función para manejar el clic en "Siguiente"
  const handleNextClick = () => {
    if (isLastSubStep) {
      if (canAdvance) {
        onNextStep(); // Avanzar al siguiente paso principal
      }
      // Si no se puede avanzar, el botón estará deshabilitado
    } else {
      onNextSubStep(currentStep); // Navegación normal entre sub-pasos
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => onPrevSubStep(currentStep)}
        disabled={!canGoBack(currentStep)}
        className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
          !canGoBack(currentStep)
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
        }`}
      >
        <ChevronLeftIcon className="h-5 w-5 mr-2" />
        {current === 1 && currentStep > 2 ? 'Paso Anterior' : 'Anterior'}
      </button>

      <div className="flex items-center space-x-2">
        {Array.from({ length: maxSubSteps }, (_, i) => (
          <div
            key={i + 1}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              current === i + 1 ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleNextClick}
        disabled={isLastSubStep && !canAdvance}
        className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
          (isLastSubStep && !canAdvance)
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
        }`}
      >
        {shouldShowNextStep ? 'Siguiente Paso' : 'Siguiente'}
        <ChevronRightIcon className="h-5 w-5 ml-2" />
      </button>
    </div>
  );
}
