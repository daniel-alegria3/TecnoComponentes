import { useState } from "react";
import { FILTER_OPTIONS } from "../constants/buildSteps";

export const useProductFilters = () => {
  const [priceRange, setPriceRange] = useState([200, 600]);

  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.id === "minPrice") {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  const limpiarFiltros = () => {
    setPriceRange([200, 600]);
  };

  return {
    priceRange,
    setPriceRange,
    handleRangeChange,
    limpiarFiltros,
    filterOptions: FILTER_OPTIONS,
  };
};
