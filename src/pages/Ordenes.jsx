import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import DeleteProductModal from "../components/DeleteProductModal";
import { useSession } from "../context/SessionContext";

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { isLoggedIn } = useSession();

  // Obtener productos y establecer categorías al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "http://localhost:5000/api/clients/vercompras", {
           method: "GET",
           credentials: 'include',
        });
        const rpta = await res.json();

        if (!res.ok) throw new Error("Error al obtener las ordenes");

        if (!rpta?.error) {
          setProducts(rpta || []);
        } else {
          setProducts([]);
        }

      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar productos
  useEffect(() => {
    setFilteredProducts(products?.filter((p) =>
      p.nombre_producto.toLowerCase().includes(search.toLowerCase())
    ));
  }, [products]);


  // CRUD Operations
  const deleteProduct = async (id) => {
    // TODO: implementar
    /*
    try {
      const res = await fetch(`http://localhost:5000/api/???/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }

      setProducts(products.filter((p) => p.id_product !== id));
    } catch (err) {
      console.error("Error:", err);
      alert("Error eliminando producto");
    }
    */
  };

  const handleDeleteProduct = (productId) => {
    deleteProduct(productId);
    setDeleteModalOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <div>
        <p>Iniciar session para ver la pag. de ordenes</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Productos</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          {/* Buscador */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Subtotal</th>
              {/* <th className="px-4 py-2">Acciones</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  Cargando productos...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-red-600">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="h-12 w-12 text-red-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-semibold">
                      Ups... Algo pasó con el servidor.
                    </p>
                    <p className="text-sm text-gray-500">
                      Inténtalo de nuevo más tarde.
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm">{product.fecha_compra}</td>
                  <td className="px-4 py-3">{product.nombre_producto}</td>
                  <td className="px-4 py-3">S/ {product.precio_compra}</td>
                  <td className="px-4 py-3">{product.cantidad}</td>
                  <td className="px-4 py-3">S/ {product.subtotal}</td>
                  {/*
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                  */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para eliminar producto */}
      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        product={selectedProduct}
        onDelete={() => handleDeleteProduct(selectedProduct?.id_product)}
      />
    </div>
  );
}
