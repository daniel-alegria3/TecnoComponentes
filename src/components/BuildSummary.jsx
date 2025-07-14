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
}) {
  const isStepComplete = canContinue;

  return (
    <div className="w-1/4">
      <div className="bg-white rounded-lg shadow p-4 sticky top-4">
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
                <p className="text-sm text-gray-500">Selecciona RAM</p>
              )}
            </div>
            {!selectedMotherboard && (
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            )}
            {selectedMotherboard && <PlusIcon className="h-5 w-5 text-blue-600" />}
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
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
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
                <p className="text-sm text-gray-500">Selecciona una GPU</p>
              )}
            </div>
            {!selectedRAM && <LockClosedIcon className="h-5 w-5 text-gray-400" />}
            {selectedRAM && <PlusIcon className="h-5 w-5 text-blue-600" />}
          </div>

          {/* Storage - Locked until GPU selection */}
          <div
            className={`flex items-center p-2 border rounded-lg transition-all ${
              !selectedGPU
                ? "border-gray-100 bg-gray-50 opacity-75"
                : "border-green-100 bg-green-50"
            }`}
          >
            <div
              className={`rounded-full p-2 mr-3 ${
                !selectedGPU ? "bg-gray-200" : "bg-green-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  !selectedGPU ? "text-gray-500" : "text-green-600"
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
                  !selectedGPU ? "text-gray-600" : "text-green-600"
                }`}
              >
                Almacenamiento
              </p>
              {!selectedGPU ? (
                <p className="text-sm text-gray-400">Pendiente de GPU</p>
              ) : selectedStorage ? (
                <p className="text-sm text-gray-500">{selectedStorage.name}</p>
              ) : (
                <p className="text-sm text-gray-500">Selecciona almacenamiento</p>
              )}
            </div>
            {!selectedGPU && <LockClosedIcon className="h-5 w-5 text-gray-400" />}
            {selectedGPU && <PlusIcon className="h-5 w-5 text-green-600" />}
          </div>

          {/* PSU - Locked until Storage selection */}
          <div
            className={`flex items-center p-2 border rounded-lg transition-all ${
              !selectedStorage
                ? "border-gray-100 bg-gray-50 opacity-75"
                : "border-green-100 bg-green-50"
            }`}
          >
            <div
              className={`rounded-full p-2 mr-3 ${
                !selectedStorage ? "bg-gray-200" : "bg-green-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  !selectedStorage ? "text-gray-500" : "text-green-600"
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
                  !selectedStorage ? "text-gray-600" : "text-green-600"
                }`}
              >
                PSU
              </p>
              {!selectedStorage ? (
                <p className="text-sm text-gray-400">Pendiente de Almacenamiento</p>
              ) : selectedPSU ? (
                <p className="text-sm text-gray-500">{selectedPSU.name}</p>
              ) : (
                <p className="text-sm text-gray-500">Selecciona una fuente</p>
              )}
            </div>
            {!selectedStorage && (
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            )}
            {selectedStorage && <PlusIcon className="h-5 w-5 text-green-600" />}
          </div>

          {/* Case - Locked until PSU selection */}
          <div
            className={`flex items-center p-2 border rounded-lg transition-all ${
              !selectedPSU
                ? "border-gray-100 bg-gray-50 opacity-75"
                : "border-blue-100 bg-blue-50"
            }`}
          >
            <div
              className={`rounded-full p-2 mr-3 ${
                !selectedPSU ? "bg-gray-200" : "bg-blue-100"
              }`}
            >
              <BookmarkIcon
                className={`h-5 w-5 ${
                  !selectedPSU ? "text-gray-500" : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  !selectedPSU ? "text-gray-600" : "text-blue-600"
                }`}
              >
                Gabinete
              </p>
              {selectedCase ? (
                <p className="text-sm text-gray-500">{selectedCase.name}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  Selecciona un gabinete
                </p>
              )}
            </div>
            {!selectedPSU && <LockClosedIcon className="h-5 w-5 text-gray-400" />}
            {selectedPSU && <PlusIcon className="h-5 w-5 text-blue-600" />}
          </div>

          {/* Cooler - Locked until Case selection */}
          <div
            className={`flex items-center p-2 border rounded-lg transition-all ${
              !selectedCase
                ? "border-gray-100 bg-gray-50 opacity-75"
                : "border-blue-100 bg-blue-50"
            }`}
          >
            <div
              className={`rounded-full p-2 mr-3 ${
                !selectedCase ? "bg-gray-200" : "bg-blue-100"
              }`}
            >
              <BookmarkIcon
                className={`h-5 w-5 ${
                  !selectedCase ? "text-gray-500" : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  !selectedCase ? "text-gray-600" : "text-blue-600"
                }`}
              >
                Refrigeración
              </p>
              {selectedCooler ? (
                <p className="text-sm text-gray-500">{selectedCooler.name}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  Selecciona un sistema de refrigeración
                </p>
              )}
            </div>
            {!selectedCase && <LockClosedIcon className="h-5 w-5 text-gray-400" />}
            {selectedCase && <PlusIcon className="h-5 w-5 text-blue-600" />}
          </div>
        </div>

        {/* Periféricos Opcionales */}
        {(selectedMonitor || selectedKeyboard || selectedMouse || selectedHeadphones || selectedSpeakers || selectedWebcam) && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Periféricos</h4>
            <div className="space-y-2">
              {selectedMonitor && (
                <div className="flex items-center p-2 border border-indigo-100 bg-indigo-50 rounded-lg">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-indigo-600 font-medium">Monitor</p>
                    <p className="text-xs text-gray-500">{selectedMonitor.name}</p>
                  </div>
                </div>
              )}
              
              {selectedKeyboard && (
                <div className="flex items-center p-2 border border-indigo-100 bg-indigo-50 rounded-lg">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-indigo-600 font-medium">Teclado</p>
                    <p className="text-xs text-gray-500">{selectedKeyboard.name}</p>
                  </div>
                </div>
              )}
              
              {selectedMouse && (
                <div className="flex items-center p-2 border border-indigo-100 bg-indigo-50 rounded-lg">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-indigo-600 font-medium">Mouse</p>
                    <p className="text-xs text-gray-500">{selectedMouse.name}</p>
                  </div>
                </div>
              )}
              
              {selectedHeadphones && (
                <div className="flex items-center p-2 border border-indigo-100 bg-indigo-50 rounded-lg">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-indigo-600 font-medium">Audífonos</p>
                    <p className="text-xs text-gray-500">{selectedHeadphones.name}</p>
                  </div>
                </div>
              )}
              
              {selectedSpeakers && (
                <div className="flex items-center p-2 border border-indigo-100 bg-indigo-50 rounded-lg">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a1 1 0 01-1-1V9a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1H9zM7 8H5a2 2 0 00-2 2v4a2 2 0 002 2h2v4a1 1 0 001 1h4a1 1 0 001-1v-4h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2V4a1 1 0 00-1-1H8a1 1 0 00-1 1v4z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-indigo-600 font-medium">Altavoces</p>
                    <p className="text-xs text-gray-500">{selectedSpeakers.name}</p>
                  </div>
                </div>
              )}
              
              {selectedWebcam && (
                <div className="flex items-center p-2 border border-indigo-100 bg-indigo-50 rounded-lg">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-indigo-600 font-medium">Webcam</p>
                    <p className="text-xs text-gray-500">{selectedWebcam.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-lg font-bold">Total PC:</span>
            <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
          </div>
          
          {/* Mostrar precio con periféricos si hay alguno seleccionado */}
          {totalPriceWithPeripherals > totalPrice && (
            <div className="flex justify-between mb-2">
              <span className="text-md font-semibold text-indigo-600">Con Periféricos:</span>
              <span className="text-md font-semibold text-indigo-600">${totalPriceWithPeripherals.toFixed(2)}</span>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-6">
            TDP estimado: {estimatedTDP}W
          </p>

          {/* Ocultar botón durante pantalla de decisión de periféricos */}
          {!showPeripheralsDecision && (
            <div className="mt-6">
              <button
                onClick={onNextStep}
                disabled={!isStepComplete || showPeripheralsDecision}
                className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isStepComplete && !showPeripheralsDecision
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Siguiente Paso
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
