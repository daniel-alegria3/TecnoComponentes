import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function ProductFilters({ 
  filters, 
  onFilterChange, 
  currentStep,
  currentSubStep 
}) {
  // Determinar qué filtros mostrar según el paso actual
  const getAvailableFilters = () => {
    const step = currentStep;
    const subStep = currentSubStep[step];
    
    // Configuración de filtros por paso y sub-paso
    const filterConfig = {
      2: { // CPU & Placa Base
        1: { // CPU
          marca: ['Todas', 'Intel', 'AMD'],
          socket: ['Todos', 'LGA1700', 'AM5', 'AM4'],
          nucleos: ['Todos', '4-8', '8-12', '12-16', '16+']
        },
        2: { // Placa Base
          marca: ['Todas', 'ASUS', 'MSI', 'Gigabyte', 'ASRock'],
          socket: ['Todos', 'LGA1700', 'AM5', 'AM4'],
          formato: ['Todos', 'ATX', 'Micro-ATX', 'Mini-ITX']
        }
      },
      3: { // RAM & GPU
        1: { // RAM
          marca: ['Todas', 'Corsair', 'G.Skill', 'Kingston', 'Crucial'],
          capacidad: ['Todas', '8GB', '16GB', '32GB', '64GB'],
          velocidad: ['Todas', 'DDR4-3200', 'DDR4-3600', 'DDR5-5600', 'DDR5-6000']
        },
        2: { // GPU
          marca: ['Todas', 'NVIDIA', 'AMD'],
          memoria: ['Todas', '4GB', '8GB', '12GB', '16GB', '24GB'],
          serie: ['Todas', 'RTX 40', 'RTX 30', 'RX 7000', 'RX 6000']
        }
      },
      4: { // Almacenamiento & PSU
        1: { // Almacenamiento
          tipo: ['Todos', 'SSD', 'HDD', 'NVMe'],
          capacidad: ['Todas', '500GB', '1TB', '2TB', '4TB'],
          marca: ['Todas', 'Samsung', 'WD', 'Seagate', 'Crucial']
        },
        2: { // PSU
          potencia: ['Todas', '500W', '650W', '750W', '850W', '1000W+'],
          certificacion: ['Todas', '80+ Bronze', '80+ Gold', '80+ Platinum'],
          modular: ['Todas', 'Modular', 'Semi-modular', 'No modular']
        }
      },
      5: { // Gabinete & Refrigeración
        1: { // Gabinete
          tamaño: ['Todos', 'Full Tower', 'Mid Tower', 'Mini ITX'],
          marca: ['Todas', 'Corsair', 'NZXT', 'Fractal Design', 'Cooler Master']
        },
        2: { // Refrigeración
          tipo: ['Todos', 'Air Cooler', 'Líquida AIO', 'Custom Loop'],
          tamaño: ['Todos', '120mm', '240mm', '280mm', '360mm']
        }
      }
    };

    return filterConfig[step]?.[subStep] || {};
  };

  const availableFilters = getAvailableFilters();

  const handleFilterChange = (filterType, value) => {
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
  };

  // Si no hay filtros disponibles para este paso, no mostrar nada
  if (Object.keys(availableFilters).length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(availableFilters).map(([filterType, options]) => (
          <div key={filterType} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {filterType}
            </label>
            <div className="relative">
              <select
                value={filters[filterType] || options[0]}
                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* Botón para limpiar filtros */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            Object.keys(availableFilters).forEach(filterType => {
              handleFilterChange(filterType, availableFilters[filterType][0]);
            });
          }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}