import ProductCard from "../ProductCard";

export default function ProductSelector({ 
  products, 
  productType, 
  selectedProduct, 
  onSelectProduct 
}) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay productos disponibles para esta categoría
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
