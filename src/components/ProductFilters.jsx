import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function ProductFilters({
  marcas,
  sockets,
  nucleosOptions,
  priceRange,
  handleRangeChange,
  limpiarFiltros,
}) {
  const onRangeChange = (e) => {
    const { id, value } = e.target;
    const newValue = Number(value);

    if (id === "minPrice") {
      if (newValue < priceRange[1]) {
        handleRangeChange(e);
      }
    } else {
      if (newValue > priceRange[0]) {
        handleRangeChange(e);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
          Filtros
        </h3>
        <button
          onClick={limpiarFiltros}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
            {marcas.map((marca) => (
              <option key={marca} value={marca.toLowerCase()}>
                {marca}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Socket
          </label>
          <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
            {sockets.map((socket) => (
              <option key={socket} value={socket.toLowerCase()}>
                {socket}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rango de Precio
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="minPrice"
              value={priceRange[0]}
              onChange={onRangeChange}
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <span>-</span>
            <input
              type="number"
              id="maxPrice"
              value={priceRange[1]}
              onChange={onRangeChange}
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Núcleos
          </label>
          <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
            {nucleosOptions.map((opcion) => (
              <option key={opcion} value={opcion.toLowerCase()}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
