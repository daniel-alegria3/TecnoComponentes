import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function BuildStepNavigator({ 
  steps, 
  currentStep, 
  completedSteps, 
  navigateToStep, 
  selectedProducts 
}) {
  
  const handleStepClick = (step) => {
    // Permitir navegación si:
    // 1. Es el paso actual
    // 2. Es un paso completado
    // 3. Es el siguiente paso inmediato y se puede avanzar a él
    const canNavigate = 
      step.id === currentStep ||
      completedSteps.has(step.id) ||
      (step.id === currentStep + 1 && selectedProducts?.canContinue(currentStep));
    
    if (canNavigate) {
      navigateToStep(step.id, selectedProducts);
    }
  };

  const getStepClickable = (step) => {
    return (
      step.id === currentStep ||
      completedSteps.has(step.id) ||
      (step.id === currentStep + 1 && selectedProducts?.canContinue(currentStep))
    );
  };

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <nav aria-label="Progress">
          <ol className="space-y-2 md:flex md:space-y-0">
            {steps.map((step, stepIdx) => {
              const isClickable = getStepClickable(step);
              
              return (
                <li key={step.id} className="md:flex-1">
                  <div
                    className={`flex items-center px-4 py-4 ${
                      currentStep === step.id
                        ? "text-blue-600 font-medium"
                        : completedSteps.has(step.id)
                        ? "text-green-600"
                        : "text-gray-500"
                    } ${
                      isClickable
                        ? "cursor-pointer hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => isClickable && handleStepClick(step)}
                    title={
                      isClickable 
                        ? `Ir al paso ${step.id}: ${step.name}` 
                        : "Complete los pasos anteriores primero"
                    }
                  >
                    <span
                      className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full transition-all ${
                        completedSteps.has(step.id)
                          ? currentStep === step.id
                            ? "bg-green-600 text-white ring-4 ring-blue-200" // Paso actual Y completado
                            : "bg-green-600 text-white" // Solo completado
                          : step.status === "current"
                          ? "border-2 border-blue-600 bg-blue-50"
                          : "border-2 border-gray-300"
                      }`}>
                      {completedSteps.has(step.id) ? (
                        <div className="relative">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {currentStep === step.id && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                      ) : (
                        <span
                          className={
                            step.status === "current"
                              ? "text-blue-600 font-semibold"
                              : "text-gray-500"
                          }
                        >
                          {step.id}
                        </span>
                      )}
                    </span>
                    <span className="ml-2 text-sm">{step.name}</span>
                  </div>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="hidden md:block absolute top-0 right-0 h-full w-6"
                      aria-hidden="true"
                    >
                      <ChevronRightIcon className="h-full w-5 text-gray-300" />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
