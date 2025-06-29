import {
  PlusIcon,
  LockClosedIcon,
  BookmarkIcon,
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
  totalPrice,
  estimatedTDP,
  onNextStep,
  canContinue,
}) {
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

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            TDP estimado: {estimatedTDP}W
          </p>

          <button
            type="button"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={onNextStep}
            disabled={!canContinue}
          >
            Siguiente Paso
          </button>
        </div>
      </div>
    </div>
  );
}
