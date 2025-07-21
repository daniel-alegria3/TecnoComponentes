import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import ProductModal from "../../components/ProductModal";
import DeleteProductModal from "../../components/DeleteProductModal";

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Nuevo estado para categorías
  const [search, setSearch] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Obtener categorias
  useEffect(() => {
    if (productModalOpen) {
      return;
    }

    const fetchCats = async () => {
      try {
        /*
        const defaultCategories = [
          { id: 1, name: "Procesadores" },
          { id: 2, name: "RAM" },
          { id: 3, name: "SSD/HDD" },
          { id: 4, name: "Laptops" },
          { id: 5, name: "GPUs" },
          { id: 6, name: "Mouse" },
          { id: 7, name: "Monitores" },
          { id: 8, name: "Teclado" },
          { id: 9, name: "Fuente de poder" },
          { id: 10, name: "Audifonos" },
        ];
        */

        const catsResponse = await fetch(
          `http://${import.meta.env.VITE_APP_IP}:5000/api/products/allcategory`
        );
        if (!catsResponse.ok) throw new Error("Error al obtener categorias");
        const cats = await catsResponse.json();
        setCategories(cats || []);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchCats();
  }, [productModalOpen]);

  // Obtener productos y establecer categorías al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsResponse = await fetch(
          `http://${import.meta.env.VITE_APP_IP}:5000/api/clients/getproducts`
        );
        if (!productsResponse.ok) throw new Error("Error al obtener productos");
        const productsData = await productsResponse.json();

        setProducts(productsData);
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
    setFilteredProducts(
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [products]);

  // CRUD Operations
  const addProduct = async (productData) => {
    try {
      const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }

      const newProduct = await res.json();
      return newProduct.id_product;
    } catch (err) {
      console.error("Error:", err);
      alert("Error agregando producto");
      throw err; // Re-lanzar el error para manejo adicional
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/products/${id}`, {
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
  };

  const editProduct = async (productData) => {
    try {
      const res = await fetch(
        `http://${import.meta.env.VITE_APP_IP}:5000/api/products/${productData.id_product}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error editando producto");
      throw err;
    }
  };

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setModalMode("add");
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    deleteProduct(productId);
    setDeleteModalOpen(false);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (modalMode === "edit") {
        await editProduct(productData);
        setProducts(
          products.map((p) =>
            p.id_product === productData.id_product ? productData : p
          )
        );
      } else {
        const newId = await addProduct(productData);
        setProducts([...products, { ...productData, id_product: newId }]);
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const downloadReport = async () => {
    try {
      const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/reports/productstock`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error("Backend no respondio bien");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "product-stock-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando reporte:", error);
    }
  }

  return (
    <div>
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

            {/* Botón agregar producto */}
            <button
              className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700"
              onClick={handleOpenAddModal}
            >
              <div className="flex items-center justify-center bg-white rounded-full h-8 w-8 shadow-lg mr-2">
                <PlusIcon className="h-4 w-4 text-gray-600" />
              </div>
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Marca</th>
                <th className="px-4 py-2">Precio Venta</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Cargando productos...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-red-600"
                  >
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
                  <td
                    colSpan="7"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id_product}>
                    <td className="px-4 py-3 text-sm">{product.id_product}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3">S/ {product.price}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal para productos */}
        <ProductModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          product={selectedProduct}
          onSave={handleSaveProduct}
          mode={modalMode}
          categories={categories}
        />

        {/* Modal para eliminar producto */}
        <DeleteProductModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          product={selectedProduct}
          onDelete={() => handleDeleteProduct(selectedProduct?.id_product)}
        />
      </div>
      <button className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 relative"
        onClick={downloadReport}
      >
        Descargar Reporte
      </button>
    </div>
  );
}
