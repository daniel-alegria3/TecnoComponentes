import ProductCard from "../ProductCard";

export default function ProductSelector({ 
  products, 
  productType, 
  selectedProduct, 
  onSelectProduct,
  noResultsMessage = "No se encontraron productos en el rango de precio establecido"
}) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="max-w-md mx-auto">
          <svg 
            className="w-16 h-16 text-gray-400 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin productos disponibles
          </h3>
          <p className="text-gray-500">
            {noResultsMessage}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Intenta ajustar los filtros para ver más opciones
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {products.map((product) => (
        <ProductCard
          key={product.id_product}
          producto={product}
          onSelect={() => onSelectProduct(productType, product)}
          isSelected={selectedProduct?.id_product === product.id_product}
          view="compact"
        />
      ))}
    </div>
  );
}
