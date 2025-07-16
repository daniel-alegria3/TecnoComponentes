import { useState, useEffect, useMemo } from "react";

export const useProductFiltering = (products = []) => {
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Resetear filtros cuando cambien los productos (diferente categoría)
  useEffect(() => {
    setSelectedBrand("Todas");
    setPriceRange([0, 10000]);
  }, [products]);

  // Filtrar productos basado en los criterios actuales
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter(product => {
      // Filtro por marca
      const brandMatch = selectedBrand === "Todas" || 
                        (product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase());

      // Filtro por precio
      const productPrice = Number(product.price) || 0;
      const priceMatch = productPrice >= priceRange[0] && productPrice <= priceRange[1];

      return brandMatch && priceMatch;
    });
  }, [products, selectedBrand, priceRange]);

  // Manejadores de eventos
  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
  };

  const clearFilters = () => {
    setSelectedBrand("Todas");
    setPriceRange([0, 10000]);
  };

  return {
    selectedBrand,
    priceRange,
    filteredProducts,
    handleBrandChange,
    handlePriceRangeChange,
    clearFilters,
    hasResults: filteredProducts.length > 0,
    totalProducts: products.length
  };
};
