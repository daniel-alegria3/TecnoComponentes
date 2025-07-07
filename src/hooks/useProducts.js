import { useState, useEffect } from "react";
import { PRODUCT_CATEGORIES } from "../constants/buildSteps";

export const useProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Fetch productos de la API
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

  // Filtrar productos por categoría
  useEffect(() => {
    const filterByCategory = (categoryKeywords) => {
      return productos.filter(p => 
        p.category && 
        categoryKeywords.some(keyword => 
          p.category.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    };

    const cpus = filterByCategory(PRODUCT_CATEGORIES.cpus);
    const motherboards = filterByCategory(PRODUCT_CATEGORIES.motherboards);
    const ramModules = filterByCategory(PRODUCT_CATEGORIES.ramModules);
    const gpus = filterByCategory(PRODUCT_CATEGORIES.gpus);
    const storageDevices = filterByCategory(PRODUCT_CATEGORIES.storageDevices);
    const psus = filterByCategory(PRODUCT_CATEGORIES.psus);
    const cases = filterByCategory(PRODUCT_CATEGORIES.cases);
    const coolers = filterByCategory(PRODUCT_CATEGORIES.coolers);

    setFilteredProducts({
      cpus,
      motherboards,
      ramModules,
      gpus,
      storageDevices,
      psus,
      cases,
      coolers
    });
  }, [productos]);

  return {
    productos,
    filteredProducts,
    loading,
    error
  };
};
