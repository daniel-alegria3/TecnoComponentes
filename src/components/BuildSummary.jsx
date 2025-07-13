import {
  PlusIcon,
  LockClosedIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import useProductImages from '../composables/useProductImages';

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
  expanded = false,
  colorOverride = null,
}) {
  // Color classes for summary (expanded) vs sidebar
  const color = colorOverride ? colorOverride : expanded ? {
    border: "border-orange-100",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    icon: "text-orange-500",
    label: "text-orange-500",
    plus: "text-orange-500",
  } : {
    border: "border-blue-100",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    icon: "text-blue-600",
    label: "text-blue-600",
    plus: "text-blue-600",
    greenBorder: "border-green-100",
    greenBg: "bg-green-50",
    greenIconBg: "bg-green-100",
    greenIcon: "text-green-600",
    greenLabel: "text-green-600",
    greenPlus: "text-green-600",
  };

  // Helper para obtener la imagen principal de un producto
  function useMainImage(product) {
    const images = product?.images_path ?? [];
    const { imageUrls } = useProductImages(images);
    return imageUrls[0];
  }

  // Helper para decidir si mostrar fondo de imagen
  function maybeBackground(product) {
    if (!expanded || !product) return null;
    const url = useMainImage(product);
    return <BackgroundImageOverlay imageUrl={url} />;
  }

  return (
    <div className={expanded ? "w-full max-w-2xl mx-auto" : "w-1/4"}>
      <div className="bg-white rounded-lg shadow p-4">
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

        {expanded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CPU */}
            <div className="relative">
              {maybeBackground(selectedCPU)}
              <div className={`flex flex-col justify-center items-start h-40 p-4 border rounded-lg relative z-10 ${color.border} ${color.bg}`}>
                <div className={`rounded-full p-2 mr-3 ${color.iconBg}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${color.icon}`}
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
                  <p className={`text-sm font-medium ${color.label}`}>CPU</p>
                  {selectedCPU ? (
                    <p className="text-sm text-gray-500">{selectedCPU.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Selecciona un procesador
                    </p>
                  )}
                </div>
                <PlusIcon className={`h-5 w-5 ${color.plus}`} />
              </div>
            </div>
            {/* Placa Base */}
            <div className="relative">
              {maybeBackground(selectedMotherboard)}
              <div className={`flex flex-col justify-center items-start h-40 p-4 border rounded-lg relative z-10 ${!selectedCPU ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
                <div
                  className={`rounded-full p-2 mr-3 ${
                    !selectedCPU ? "bg-gray-200" : expanded ? color.iconBg : "bg-blue-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      !selectedCPU ? "text-gray-500" : expanded ? color.icon : "text-blue-600"
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
                      !selectedCPU ? "text-gray-600" : expanded ? color.label : "text-blue-600"
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
                {selectedCPU && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
              </div>
            </div>
            {/* RAM */}
            <div className="relative">
              {maybeBackground(selectedRAM)}
              <div className={`flex flex-col justify-center items-start h-40 p-4 border rounded-lg relative z-10 ${!selectedMotherboard ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
                <div
                  className={`rounded-full p-2 mr-3 ${
                    !selectedMotherboard ? "bg-gray-200" : expanded ? color.iconBg : "bg-green-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      !selectedMotherboard ? "text-gray-500" : expanded ? color.icon : "text-green-600"
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
                      !selectedMotherboard ? "text-gray-600" : expanded ? color.label : "text-green-600"
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
                {selectedMotherboard && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
              </div>
            </div>
            {/* GPU */}
            <div className="relative">
              {maybeBackground(selectedGPU)}
              <div className={`flex flex-col justify-center items-start h-40 p-4 border rounded-lg relative z-10 ${!selectedRAM ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
                <div
                  className={`rounded-full p-2 mr-3 ${
                    !selectedRAM ? "bg-gray-200" : expanded ? color.iconBg : "bg-green-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      !selectedRAM ? "text-gray-500" : expanded ? color.icon : "text-green-600"
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
                      !selectedRAM ? "text-gray-600" : expanded ? color.label : "text-green-600"
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
                {selectedRAM && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
              </div>
            </div>
            {/* Storage */}
            <div className="relative">
              {maybeBackground(selectedStorage)}
              <div className={`flex flex-col justify-center items-start h-40 p-4 border rounded-lg relative z-10 ${!selectedGPU ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
                <div
                  className={`rounded-full p-2 mr-3 ${
                    !selectedGPU ? "bg-gray-200" : expanded ? color.iconBg : "bg-green-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      !selectedGPU ? "text-gray-500" : expanded ? color.icon : "text-green-600"
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
                      !selectedGPU ? "text-gray-600" : expanded ? color.label : "text-green-600"
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
                {selectedGPU && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-green-600"}`} />}
              </div>
            </div>
            {/* PSU */}
            <div className="relative">
              {maybeBackground(selectedPSU)}
              <div className={`flex flex-col justify-center items-start h-40 p-4 border rounded-lg relative z-10 ${!selectedStorage ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
                <div
                  className={`rounded-full p-2 mr-3 ${
                    !selectedStorage ? "bg-gray-200" : expanded ? color.iconBg : "bg-green-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      !selectedStorage ? "text-gray-500" : expanded ? color.icon : "text-green-600"
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
                      !selectedStorage ? "text-gray-600" : expanded ? color.label : "text-green-600"
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
                {selectedStorage && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-green-600"}`} />}
              </div>
            </div>
            {/* Case */}
            <div className="relative">
              {maybeBackground(selectedCase)}
              <div className={`flex flex-col justify-center items-start h-40 p-4 border rounded-lg relative z-10 ${!selectedPSU ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
                <div
                  className={`rounded-full p-2 mr-3 ${
                    !selectedPSU ? "bg-gray-200" : expanded ? color.iconBg : "bg-blue-100"
                  }`}
                >
                  <BookmarkIcon
                    className={`h-5 w-5 ${
                      !selectedPSU ? "text-gray-500" : expanded ? color.icon : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      !selectedPSU ? "text-gray-600" : expanded ? color.label : "text-blue-600"
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
                {selectedPSU && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
              </div>
            </div>
            {/* Cooler */}
            <div className="relative">
              {maybeBackground(selectedCooler)}
              <div className={`flex flex-col justify-center items-start h-40 p-4 border rounded-lg relative z-10 ${!selectedCase ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
                <div
                  className={`rounded-full p-2 mr-3 ${
                    !selectedCase ? "bg-gray-200" : expanded ? color.iconBg : "bg-blue-100"
                  }`}
                >
                  <BookmarkIcon
                    className={`h-5 w-5 ${
                      !selectedCase ? "text-gray-500" : expanded ? color.icon : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      !selectedCase ? "text-gray-600" : expanded ? color.label : "text-blue-600"
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
                {selectedCase && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* CPU */}
            <div className={`flex items-center p-2 border rounded-lg ${color.border} ${color.bg}`}>
              <div className={`rounded-full p-2 mr-3 ${color.iconBg}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${color.icon}`}
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
                <p className={`text-sm font-medium ${color.label}`}>CPU</p>
                {selectedCPU ? (
                  <p className="text-sm text-gray-500">{selectedCPU.name}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Selecciona un procesador
                  </p>
                )}
              </div>
              <PlusIcon className={`h-5 w-5 ${color.plus}`} />
            </div>
            {/* Placa Base */}
            <div className={`flex items-center p-2 border rounded-lg ${!selectedCPU ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
              <div
                className={`rounded-full p-2 mr-3 ${
                  !selectedCPU ? "bg-gray-200" : expanded ? color.iconBg : "bg-blue-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    !selectedCPU ? "text-gray-500" : expanded ? color.icon : "text-blue-600"
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
                    !selectedCPU ? "text-gray-600" : expanded ? color.label : "text-blue-600"
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
              {selectedCPU && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
            </div>
            {/* RAM */}
            <div className={`flex items-center p-2 border rounded-lg ${!selectedMotherboard ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
              <div
                className={`rounded-full p-2 mr-3 ${
                  !selectedMotherboard ? "bg-gray-200" : expanded ? color.iconBg : "bg-green-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    !selectedMotherboard ? "text-gray-500" : expanded ? color.icon : "text-green-600"
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
                    !selectedMotherboard ? "text-gray-600" : expanded ? color.label : "text-green-600"
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
              {selectedMotherboard && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
            </div>
            {/* GPU */}
            <div className={`flex items-center p-2 border rounded-lg ${!selectedRAM ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
              <div
                className={`rounded-full p-2 mr-3 ${
                  !selectedRAM ? "bg-gray-200" : expanded ? color.iconBg : "bg-green-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    !selectedRAM ? "text-gray-500" : expanded ? color.icon : "text-green-600"
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
                    !selectedRAM ? "text-gray-600" : expanded ? color.label : "text-green-600"
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
              {selectedRAM && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
            </div>
            {/* Storage */}
            <div className={`flex items-center p-2 border rounded-lg ${!selectedGPU ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
              <div
                className={`rounded-full p-2 mr-3 ${
                  !selectedGPU ? "bg-gray-200" : expanded ? color.iconBg : "bg-green-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    !selectedGPU ? "text-gray-500" : expanded ? color.icon : "text-green-600"
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
                    !selectedGPU ? "text-gray-600" : expanded ? color.label : "text-green-600"
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
              {selectedGPU && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-green-600"}`} />}
            </div>
            {/* PSU */}
            <div className={`flex items-center p-2 border rounded-lg ${!selectedStorage ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
              <div
                className={`rounded-full p-2 mr-3 ${
                  !selectedStorage ? "bg-gray-200" : expanded ? color.iconBg : "bg-green-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    !selectedStorage ? "text-gray-500" : expanded ? color.icon : "text-green-600"
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
                    !selectedStorage ? "text-gray-600" : expanded ? color.label : "text-green-600"
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
              {selectedStorage && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-green-600"}`} />}
            </div>
            {/* Case */}
            <div className={`flex items-center p-2 border rounded-lg ${!selectedPSU ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
              <div
                className={`rounded-full p-2 mr-3 ${
                  !selectedPSU ? "bg-gray-200" : expanded ? color.iconBg : "bg-blue-100"
                }`}
              >
                <BookmarkIcon
                  className={`h-5 w-5 ${
                    !selectedPSU ? "text-gray-500" : expanded ? color.icon : "text-blue-600"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    !selectedPSU ? "text-gray-600" : expanded ? color.label : "text-blue-600"
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
              {selectedPSU && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
            </div>
            {/* Cooler */}
            <div className={`flex items-center p-2 border rounded-lg ${!selectedCase ? "border-gray-100 bg-gray-50 opacity-75" : `${color.border} ${color.bg}`}`}>
              <div
                className={`rounded-full p-2 mr-3 ${
                  !selectedCase ? "bg-gray-200" : expanded ? color.iconBg : "bg-blue-100"
                }`}
              >
                <BookmarkIcon
                  className={`h-5 w-5 ${
                    !selectedCase ? "text-gray-500" : expanded ? color.icon : "text-blue-600"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    !selectedCase ? "text-gray-600" : expanded ? color.label : "text-blue-600"
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
              {selectedCase && <PlusIcon className={`h-5 w-5 ${expanded ? color.plus : "text-blue-600"}`} />}
            </div>
          </div>
        )}

        {/* Solo mostrar total, TDP y botón si NO es expanded (no es resumen final) */}
        {!expanded && (
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
        )}
      </div>
    </div>
  );
}

// Componente para overlay de imagen de fondo
function BackgroundImageOverlay({ imageUrl }) {
  if (!imageUrl) return null;
  return (
    <div
      className="absolute inset-0 rounded-lg overflow-hidden z-0"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.18,
        filter: 'blur(0.5px) grayscale(0.2)',
        pointerEvents: 'none',
      }}
    />
  );
}
