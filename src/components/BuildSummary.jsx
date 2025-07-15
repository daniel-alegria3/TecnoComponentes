import {
  PlusIcon,
  LockClosedIcon,
  BookmarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function BuildSummary({
  selectedCPU,
  selectedMotherboard,
  selectedRAM,
  selectedGPU,
  selectedStorage,
  selectedPSU,
  selectedCase,
  selectedCooler,
  selectedMonitor,
  selectedKeyboard,
  selectedMouse,
  selectedHeadphones,
  selectedSpeakers,
  selectedWebcam,
  totalPrice,
  totalPriceWithPeripherals,
  estimatedTDP,
  onNextStep,
  canContinue,
  showPeripheralsDecision,
  expanded = false,
  colorOverride = {}
}) {
  const baseStyles = {
    border: "border-gray-200",
    bg: "bg-white",
    iconBg: "bg-gray-100",
    icon: "text-gray-500",
    label: "text-gray-800",
    plus: "text-gray-400"
  };

  const styles = { ...baseStyles, ...colorOverride };

  const containerClasses = `
    p-6 rounded-lg shadow-md
    ${styles.bg}
  `;

  const getBorderColor = (product) => {
    if (product) {
      return "border-transparent";
    }
    return "border-gray-100";
  };

  const isStepComplete = canContinue;

  const summaryContent = (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Tu Build</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* CPU - To be selected */}
        <div className="flex items-center p-2 border border-blue-100 bg-blue-50 rounded-lg">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-600 font-medium">CPU</p>
            {selectedCPU ? (
              <p className="text-sm text-gray-500">{selectedCPU.name}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Selecciona un procesador
              </p>
            )}
          </div>
          <PlusIcon className="h-5 w-5 text-blue-600" />
        </div>

        {/* Placa Base - Locked until CPU selection */}
        <div
          className={`flex items-center p-2 border rounded-lg transition-all ${
            !selectedCPU
              ? "border-gray-100 bg-gray-50 opacity-75"
              : "border-blue-100 bg-blue-50"
          }`}
        >
          <div
            className={`rounded-full p-2 mr-3 ${
              !selectedCPU ? "bg-gray-200" : "bg-blue-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                !selectedCPU ? "text-gray-500" : "text-blue-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                !selectedCPU ? "text-gray-600" : "text-blue-600"
              }`}
            >
              Placa Base
            </p>
            {!selectedCPU ? (
              <p className="text-sm text-gray-400">Pendiente de CPU</p>
            ) : selectedMotherboard ? (
              <p className="text-sm text-gray-500">
                {selectedMotherboard.name}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Selecciona una placa base
              </p>
            )}
          </div>
          {!selectedCPU && <LockClosedIcon className="h-5 w-5 text-gray-400" />}
          {selectedCPU && <PlusIcon className="h-5 w-5 text-blue-600" />}
        </div>

        {/* RAM - Locked until Motherboard selection */}
        <div
          className={`flex items-center p-2 border rounded-lg transition-all ${
            !selectedMotherboard
              ? "border-gray-100 bg-gray-50 opacity-75"
              : "border-green-100 bg-green-50"
          }`}
        >
          <div
            className={`rounded-full p-2 mr-3 ${
              !selectedMotherboard ? "bg-gray-200" : "bg-green-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                !selectedMotherboard ? "text-gray-500" : "text-green-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                !selectedMotherboard ? "text-gray-600" : "text-green-600"
              }`}
            >
              RAM
            </p>
            {!selectedMotherboard ? (
              <p className="text-sm text-gray-400">Pendiente de Placa Base</p>
            ) : selectedRAM ? (
              <p className="text-sm text-gray-500">{selectedRAM.name}</p>
            ) : (
              <p className="text-sm text-gray-500">Selecciona una RAM</p>
            )}
          </div>
          {!selectedMotherboard && (
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          )}
          {selectedMotherboard && <PlusIcon className="h-5 w-5 text-green-600" />}
        </div>

        {/* GPU - Locked until RAM selection */}
        <div
          className={`flex items-center p-2 border rounded-lg transition-all ${
            !selectedRAM
              ? "border-gray-100 bg-gray-50 opacity-75"
              : "border-green-100 bg-green-50"
          }`}
        >
          <div
            className={`rounded-full p-2 mr-3 ${
              !selectedRAM ? "bg-gray-200" : "bg-green-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                !selectedRAM ? "text-gray-500" : "text-green-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                !selectedRAM ? "text-gray-600" : "text-green-600"
              }`}
            >
              GPU
            </p>
            {!selectedRAM ? (
              <p className="text-sm text-gray-400">Pendiente de RAM</p>
            ) : selectedGPU ? (
              <p className="text-sm text-gray-500">{selectedGPU.name}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Selecciona una tarjeta gráfica
              </p>
            )}
          </div>
          {!selectedRAM && <LockClosedIcon className="h-5 w-5 text-gray-400" />}
          {selectedRAM && <PlusIcon className="h-5 w-5 text-green-600" />}
        </div>

        {/* Almacenamiento - Locked until GPU selection */}
        <div
          className={`flex items-center p-2 border rounded-lg transition-all ${
            !selectedGPU
              ? "border-gray-100 bg-gray-50 opacity-75"
              : "border-yellow-100 bg-yellow-50"
          }`}
        >
          <div
            className={`rounded-full p-2 mr-3 ${
              !selectedGPU ? "bg-gray-200" : "bg-yellow-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                !selectedGPU ? "text-gray-500" : "text-yellow-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                !selectedGPU ? "text-gray-600" : "text-yellow-600"
              }`}
            >
              Almacenamiento
            </p>
            {!selectedGPU ? (
              <p className="text-sm text-gray-400">Pendiente de GPU</p>
            ) : selectedStorage ? (
              <p className="text-sm text-gray-500">{selectedStorage.name}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Selecciona almacenamiento
              </p>
            )}
          </div>
          {!selectedGPU && <LockClosedIcon className="h-5 w-5 text-gray-400" />}
          {selectedGPU && <PlusIcon className="h-5 w-5 text-yellow-600" />}
        </div>

        {/* PSU - Locked until Storage selection */}
        <div
          className={`flex items-center p-2 border rounded-lg transition-all ${
            !selectedStorage
              ? "border-gray-100 bg-gray-50 opacity-75"
              : "border-yellow-100 bg-yellow-50"
          }`}
        >
          <div
            className={`rounded-full p-2 mr-3 ${
              !selectedStorage ? "bg-gray-200" : "bg-yellow-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                !selectedStorage ? "text-gray-500" : "text-yellow-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                !selectedStorage ? "text-gray-600" : "text-yellow-600"
              }`}
            >
              PSU
            </p>
            {!selectedStorage ? (
              <p className="text-sm text-gray-400">
                Pendiente de Almacenamiento
              </p>
            ) : selectedPSU ? (
              <p className="text-sm text-gray-500">{selectedPSU.name}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Selecciona una fuente de poder
              </p>
            )}
          </div>
          {!selectedStorage && (
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          )}
          {selectedStorage && <PlusIcon className="h-5 w-5 text-yellow-600" />}
        </div>

        {/* Gabinete - Locked until PSU selection */}
        <div
          className={`flex items-center p-2 border rounded-lg transition-all ${
            !selectedPSU
              ? "border-gray-100 bg-gray-50 opacity-75"
              : "border-purple-100 bg-purple-50"
          }`}
        >
          <div
            className={`rounded-full p-2 mr-3 ${
              !selectedPSU ? "bg-gray-200" : "bg-purple-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                !selectedPSU ? "text-gray-500" : "text-purple-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                !selectedPSU ? "text-gray-600" : "text-purple-600"
              }`}
            >
              Gabinete
            </p>
            {!selectedPSU ? (
              <p className="text-sm text-gray-400">Pendiente de PSU</p>
            ) : selectedCase ? (
              <p className="text-sm text-gray-500">{selectedCase.name}</p>
            ) : (
              <p className="text-sm text-gray-500">Selecciona un gabinete</p>
            )}
          </div>
          {!selectedPSU && <LockClosedIcon className="h-5 w-5 text-gray-400" />}
          {selectedPSU && <PlusIcon className="h-5 w-5 text-purple-600" />}
        </div>

        {/* Refrigeración - Locked until Case selection */}
        <div
          className={`flex items-center p-2 border rounded-lg transition-all ${
            !selectedCase
              ? "border-gray-100 bg-gray-50 opacity-75"
              : "border-purple-100 bg-purple-50"
          }`}
        >
          <div
            className={`rounded-full p-2 mr-3 ${
              !selectedCase ? "bg-gray-200" : "bg-purple-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                !selectedCase ? "text-gray-500" : "text-purple-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                !selectedCase ? "text-gray-600" : "text-purple-600"
              }`}
            >
              Refrigeración
            </p>
            {!selectedCase ? (
              <p className="text-sm text-gray-400">Pendiente de Gabinete</p>
            ) : selectedCooler ? (
              <p className="text-sm text-gray-500">{selectedCooler.name}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Selecciona refrigeración
              </p>
            )}
          </div>
          {!selectedCase && <LockClosedIcon className="h-5 w-5 text-gray-400" />}
          {selectedCase && <PlusIcon className="h-5 w-5 text-purple-600" />}
        </div>

        {/* Periféricos */}
        {(selectedMonitor ||
          selectedKeyboard ||
          selectedMouse ||
          selectedHeadphones ||
          selectedSpeakers ||
          selectedWebcam) && (
          <>
            <hr className="my-4" />
            <h4 className="text-md font-bold">Periféricos</h4>
            {selectedMonitor && (
              <div className="flex items-center p-2 border border-indigo-100 bg-indigo-50 rounded-lg">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-indigo-600 font-medium">Monitor</p>
                  <p className="text-sm text-gray-500">{selectedMonitor.name}</p>
                </div>
                <PlusIcon className="h-5 w-5 text-indigo-600" />
              </div>
            )}
            {selectedKeyboard && (
              <div className="flex items-center p-2 border border-pink-100 bg-pink-50 rounded-lg">
                <div className="bg-pink-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-pink-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-pink-600 font-medium">Teclado</p>
                  <p className="text-sm text-gray-500">
                    {selectedKeyboard.name}
                  </p>
                </div>
                <PlusIcon className="h-5 w-5 text-pink-600" />
              </div>
            )}
            {selectedMouse && (
              <div className="flex items-center p-2 border border-red-100 bg-red-50 rounded-lg">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-red-600 font-medium">Mouse</p>
                  <p className="text-sm text-gray-500">{selectedMouse.name}</p>
                </div>
                <PlusIcon className="h-5 w-5 text-red-600" />
              </div>
            )}
            {selectedHeadphones && (
              <div className="flex items-center p-2 border border-orange-100 bg-orange-50 rounded-lg">
                <div className="bg-orange-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 8v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V8a2 2 0 012-2h2a2 2 0 012 2zM6 8v8a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-orange-600 font-medium">
                    Audífonos
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedHeadphones.name}
                  </p>
                </div>
                <PlusIcon className="h-5 w-5 text-orange-600" />
              </div>
            )}
            {selectedSpeakers && (
              <div className="flex items-center p-2 border border-lime-100 bg-lime-50 rounded-lg">
                <div className="bg-lime-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-lime-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M12 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-lime-600 font-medium">Altavoces</p>
                  <p className="text-sm text-gray-500">
                    {selectedSpeakers.name}
                  </p>
                </div>
                <PlusIcon className="h-5 w-5 text-lime-600" />
              </div>
            )}
            {selectedWebcam && (
              <div className="flex items-center p-2 border border-cyan-100 bg-cyan-50 rounded-lg">
                <div className="bg-cyan-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-cyan-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.55a1 1 0 011.45.89V15a1 1 0 01-1.45.89L15 14M4 5h11a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-cyan-600 font-medium">Webcam</p>
                  <p className="text-sm text-gray-500">{selectedWebcam.name}</p>
                </div>
                <PlusIcon className="h-5 w-5 text-cyan-600" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Total y botón de continuar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">TDP Estimado</span>
          <span className="text-sm font-medium text-gray-800">
            {estimatedTDP}W
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold">
            $
            {totalPriceWithPeripherals > 0
              ? totalPriceWithPeripherals.toFixed(2)
              : totalPrice.toFixed(2)}
          </span>
        </div>

        {!showPeripheralsDecision && (
          <button
            onClick={onNextStep}
            disabled={!isStepComplete}
            className={`w-full text-white py-2 rounded-lg text-lg shadow-md transition-all ${
              isStepComplete
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isStepComplete ? "Siguiente" : "Completa este paso"}
          </button>
        )}
      </div>
    </div>
  );

  if (expanded) {
    return summaryContent;
  }

  return <div className="w-1/4">{summaryContent}</div>;
}
