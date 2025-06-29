import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import BuildStepNavigator from "../components/BuildStepNavigator";
import ProductFilters from "../components/ProductFilters";
import BuildSummary from "../components/BuildSummary";
import ProductCard from "../components/ProductCard";

export default function ArmaTuPC() {
  const [currentStep, setCurrentStep] = useState(2);
  const [priceRange, setPriceRange] = useState([200, 600]);
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedPSU, setSelectedPSU] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCooler, setSelectedCooler] = useState(null);
  const [steps, setSteps] = useState([
    { id: 1, name: "Inicio", href: "#", status: "complete" },
    { id: 2, name: "CPU & Placa Base", href: "#", status: "current" },
    { id: 3, name: "RAM & GPU", href: "#", status: "upcoming" },
    { id: 4, name: "Almacenamiento & PSU", href: "#", status: "upcoming" },
    { id: 5, name: "Gabinete & Refrigeración", href: "#", status: "upcoming" },
    { id: 6, name: "Resumen Final", href: "#", status: "upcoming" },
  ]);

  // Productos de la base de datos
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/api/clients/getproducts");
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Opciones para los filtros
  const marcas = ["Todas", "Intel", "AMD"];
  const sockets = ["Todos", "LGA1700", "AM5", "AM4"];
  const nucleosOptions = ["Todos", "4-8", "8-12", "12-16", "16+"];

  const [filteredProducts, setFilteredProducts] = useState({
    cpus: [],
    motherboards: [],
    ramModules: [],
    gpus: [],
    storageDevices: [],
    psus: [],
    cases: [],
    coolers: [],
  });

  useEffect(() => {
    const cpus = productos.filter(p => p.category && p.category.toLowerCase().includes("procesador"));
    const motherboards = productos.filter(p => p.category && (p.category.toLowerCase().includes("placa") || p.category.toLowerCase().includes("mother")));
    const ramModules = productos.filter(p => p.category && p.category.toLowerCase().includes("ram"));
    const gpus = productos.filter(p => p.category && (p.category.toLowerCase().includes("gpu") || p.category.toLowerCase().includes("tarjeta gráfica") || p.category.toLowerCase().includes("gráfica")));
    const storageDevices = productos.filter(p => p.category && (p.category.toLowerCase().includes("ssd") || p.category.toLowerCase().includes("hdd") || p.category.toLowerCase().includes("almacenamiento")));
    const psus = productos.filter(p => p.category && (p.category.toLowerCase().includes("fuente") || p.category.toLowerCase().includes("psu")));
    const cases = productos.filter(p => p.category && (p.category.toLowerCase().includes("gabinete") || p.category.toLowerCase().includes("case")));
    const coolers = productos.filter(p => p.category && (p.category.toLowerCase().includes("refrigeración") || p.category.toLowerCase().includes("cooler")));

    setFilteredProducts({ cpus, motherboards, ramModules, gpus, storageDevices, psus, cases, coolers });
  }, [productos]);

  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.id === "minPrice") {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  const limpiarFiltros = () => {
    // Aquí reset de los filtros
    setPriceRange([200, 600]);
  };

  const handleSelectCPU = (cpu) => {
    setSelectedCPU(cpu);
  };

  const handleSelectMotherboard = (motherboard) => {
    setSelectedMotherboard(motherboard);
  };

  const handleSelectRAM = (ram) => {
    setSelectedRAM(ram);
  };

  const handleSelectGPU = (gpu) => {
    setSelectedGPU(gpu);
  };

  const handleSelectStorage = (storage) => {
    setSelectedStorage(storage);
  };

  const handleSelectPSU = (psu) => {
    setSelectedPSU(psu);
  };

  const handleSelectCase = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const handleSelectCooler = (cooler) => {
    setSelectedCooler(cooler);
  };

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
  };

  const compatibleMotherboards = filteredProducts.motherboards;

  const totalPrice =
    parseFloat(selectedCPU?.price || 0) +
    parseFloat(selectedMotherboard?.price || 0) +
    parseFloat(selectedRAM?.price || 0) +
    parseFloat(selectedGPU?.price || 0) +
    parseFloat(selectedStorage?.price || 0) +
    parseFloat(selectedPSU?.price || 0) +
    parseFloat(selectedCase?.price || 0) +
    parseFloat(selectedCooler?.price || 0);

  const estimatedTDP = 0; // Se elimina la dependencia de specs.TDP

  return (
    <div className="min-h-screen bg-gray-50 font-monofur">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Tecno<span className="text-violet-500">Componentes</span>
            </Link>
            <span className="mx-2 text-gray-400 font-light">/</span>
            <h1 className="text-gray-600">Arma tu PC</h1>
          </div>
          <div className="flex space-x-4">
            <button type="button" className="text-gray-600 hover:text-gray-800">
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
            <button type="button" className="text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Steps Navigation */}
      <BuildStepNavigator
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 flex">
        <main className="flex-1 pr-8">
          {currentStep === 2 &&
            (loading ? (
              <div className="text-center py-8">Cargando productos...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error: {error}</div>
            ) : (
              <div>
                {/* CPU Selection */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Paso 2.1: Elige tu Procesador
                </h2>
                <ProductFilters
                  marcas={marcas}
                  sockets={sockets}
                  nucleosOptions={nucleosOptions}
                  priceRange={priceRange}
                  onRangeChange={handleRangeChange}
                  onLimpiarFiltros={limpiarFiltros}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredProducts.cpus.map((cpu) => (
                    <ProductCard
                      key={cpu.id_product}
                      producto={cpu}
                      onSelect={() => handleSelectCPU(cpu)}
                      isSelected={selectedCPU?.id_product === cpu.id_product}
                      view="compact"
                    />
                  ))}
                </div>

                {/* Motherboard Selection */}
                {selectedCPU && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Paso 2.2: Elige tu Placa Base
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {compatibleMotherboards.map((mb) => (
                        <ProductCard
                          key={mb.id_product}
                          producto={mb}
                          onSelect={() => handleSelectMotherboard(mb)}
                          isSelected={
                            selectedMotherboard?.id_product === mb.id_product
                          }
                          view="compact"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {currentStep === 3 &&
            (loading ? (
              <div className="text-center py-8">Cargando productos...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error: {error}</div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Paso 3.1: Elige tu Memoria RAM
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredProducts.ramModules.map((ram) => (
                    <ProductCard
                      key={ram.id_product}
                      producto={ram}
                      onSelect={() => handleSelectRAM(ram)}
                      isSelected={selectedRAM?.id_product === ram.id_product}
                      view="compact"
                    />
                  ))}
                </div>

                {selectedRAM && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Paso 3.2: Elige tu Tarjeta Gráfica (GPU)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {filteredProducts.gpus.map((gpu) => (
                        <ProductCard
                          key={gpu.id_product}
                          producto={gpu}
                          onSelect={() => handleSelectGPU(gpu)}
                          isSelected={selectedGPU?.id_product === gpu.id_product}
                          view="compact"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {currentStep === 4 &&
            (loading ? (
              <div className="text-center py-8">Cargando productos...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error: {error}</div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Paso 4.1: Elige tu Almacenamiento
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredProducts.storageDevices.map((storage) => (
                    <ProductCard
                      key={storage.id_product}
                      producto={storage}
                      onSelect={() => handleSelectStorage(storage)}
                      isSelected={
                        selectedStorage?.id_product === storage.id_product
                      }
                      view="compact"
                    />
                  ))}
                </div>

                {selectedStorage && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Paso 4.2: Elige tu Fuente de Alimentación (PSU)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {filteredProducts.psus.map((psu) => (
                        <ProductCard
                          key={psu.id_product}
                          producto={psu}
                          onSelect={() => handleSelectPSU(psu)}
                          isSelected={selectedPSU?.id_product === psu.id_product}
                          view="compact"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {currentStep === 5 &&
            (loading ? (
              <div className="text-center py-8">Cargando productos...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error: {error}</div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Paso 5.1: Elige tu Gabinete
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredProducts.cases.map((caseItem) => (
                    <ProductCard
                      key={caseItem.id_product}
                      producto={caseItem}
                      onSelect={() => handleSelectCase(caseItem)}
                      isSelected={selectedCase?.id_product === caseItem.id_product}
                      view="compact"
                    />
                  ))}
                </div>

                {selectedCase && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Paso 5.2: Elige tu Sistema de Refrigeración
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {filteredProducts.coolers.map((cooler) => (
                        <ProductCard
                          key={cooler.id_product}
                          producto={cooler}
                          onSelect={() => handleSelectCooler(cooler)}
                          isSelected={
                            selectedCooler?.id_product === cooler.id_product
                          }
                          view="compact"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </main>

        <BuildSummary
          selectedCPU={selectedCPU}
          selectedMotherboard={selectedMotherboard}
          selectedRAM={selectedRAM}
          selectedGPU={selectedGPU}
          selectedStorage={selectedStorage}
          selectedPSU={selectedPSU}
          selectedCase={selectedCase}
          selectedCooler={selectedCooler}
          totalPrice={totalPrice}
          estimatedTDP={estimatedTDP}
          onNextStep={handleNextStep}
          canContinue={
            (currentStep === 2 && selectedCPU && selectedMotherboard) ||
            (currentStep === 3 && selectedRAM && selectedGPU) ||
            (currentStep === 4 && selectedStorage && selectedPSU) ||
            (currentStep === 5 && selectedCase && selectedCooler)
          }
        />
      </div>
    </div>
  );
}