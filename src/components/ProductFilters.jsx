import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function ProductFilters({
  products = [],
  selectedBrand = "Todas",
  priceRange = [0, 10000],
  onBrandChange = () => {},
  onPriceRangeChange = () => {},
  onClearFilters = () => {},
}) {
  // Obtener marcas únicas de los productos actuales
  const getUniqueBrands = () => {
    if (!products || products.length === 0) return ["Todas"];
    
    const brands = products
      .map(product => product.brand)
      .filter(brand => brand && brand.trim() !== "")
      .filter((brand, index, array) => array.indexOf(brand) === index)
      .sort();
    
    return ["Todas", ...brands];
  };

  const uniqueBrands = getUniqueBrands();

  const handlePriceChange = (e) => {
    const { id, value } = e.target;
    const newValue = Number(value);

    if (id === "minPrice") {
      if (newValue <= priceRange[1]) {
        onPriceRangeChange([newValue, priceRange[1]]);
      }
    } else if (id === "maxPrice") {
      if (newValue >= priceRange[0]) {
        onPriceRangeChange([priceRange[0], newValue]);
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
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro de Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <select 
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Rango de Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rango de Precio
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="minPrice"
              value={priceRange[0]}
              onChange={handlePriceChange}
              placeholder="Mín"
              min="0"
              max="50000"
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              id="maxPrice"
              value={priceRange[1]}
              onChange={handlePriceChange}
              placeholder="Máx"
              min="0"
              max="50000"
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
