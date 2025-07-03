import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";

const ProductsContext = createContext({
  products: [],
  getProductByID: async() => {},
  updateProductByID: async() => {},
  initProducts: async() => {},
  productsData: [], // for internal use
});

export const useProducts = () => useContext(ProductsContext)

export function ProductsProvider({ children }) {
  const [productsData, setProductsData] = useState([]);
  const products = useMemo(() => {
    return Object.values(productsData);
  }, [productsData]);

  useEffect(() => {
    initProducts();
  }, []);

  const initProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/clients/getproducts", {
        method: "GET",
        credentials: 'include',
      });

      const rpta = await res.json();

      if (!res.ok) {
        throw new Error(rpta.error);
      }

      let prods = {};
      if (!rpta?.error && Array.isArray(rpta)) {
        prods = rpta.reduce((acc, obj) => {
          acc[obj.id_product] = obj;
          return acc;
        }, {});
      }
      setProductsData(prods);
    } catch (err) {
      console.log("Error: ", err.message || "Error obteniendo informacion del Carrito")
    }
  };

  ///[ DEBUG FUNCTION
  // useEffect(() => {
  //       console.log("=== RELOADED ============================\n")
  //       console.log(products)
  //       console.log("=\n")
  // }, [products]);
  ///[ END DEBUG FUNCTION

  const getProductByID = useCallback((id) => {
    return productsData[id] || null;
  }, [productsData]);

  const updateProductByID = useCallback((id, updates) => {
    setProductsData(prev => {
      if (!prev[id]) {
        console.warn(`Product with ID ${id} not found for update`);
        return prev;
      }

      const updatedProduct = typeof updates === 'function'
        ? updates(prev[id])
        : { ...prev[id], ...updates };

      return {
        ...prev,
        [id]: updatedProduct
      };
    });
  }, []);


  const contextValue = useMemo(() => ({
    products,
    getProductByID,
    updateProductByID,
    initProducts,
    productsData, // for internal use
  }), [products, getProductByID, updateProductByID, productsData]);

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProduct(id) {
  if (!id)
    return [null, null]

  const { productsData, updateProductByID } = useProducts();

  const product = productsData[id] || null;

  const setProduct = useCallback((updates) => {
    updateProductByID(id, updates);
  }, [id, updateProductByID]);

  return [product, setProduct];
}

