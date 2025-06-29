import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function BuildStepNavigator({ steps, currentStep, setCurrentStep }) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex justify-between" aria-label="Progress">
          <ol className="space-y-2 md:flex md:space-y-0">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className="md:flex-1">
                <div
                  className={`flex items-center px-4 py-4 ${
                    currentStep === step.id
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                  } ${
                    stepIdx < currentStep
                      ? "cursor-pointer hover:text-blue-800"
                      : ""
                  }`}
                  onClick={() => stepIdx < currentStep && setCurrentStep(step.id)}
                >
                  <span
                    className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full ${
                      step.status === "complete"
                        ? "bg-blue-600"
                        : step.status === "current"
                        ? "border-2 border-blue-600"
                        : "border-2 border-gray-300"
                    }`}>
                    {step.status === "complete" ? (
                      <span className="text-white">{step.id}</span>
                    ) : (
                      <span
                        className={
                          step.status === "current"
                            ? "text-blue-600"
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
            ))}
          </ol>
          <div className="flex items-center">
            <button className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                />
              </svg>
              Recomiéndame
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
