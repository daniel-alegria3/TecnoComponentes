import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import ProductModal from "../components/ProductModal";
import DeleteProductModal from "../components/DeleteProductModal";

export default function Productos() {
  const initialProducts = [
    { id: 1, nombre: "Mouse Logitech G502", precioVenta: "$25.99", stock: 14 },
    { id: 2, nombre: "Teclado Corsair K70", precioVenta: "$99.99", stock: 8 },
    {
      id: 3,
      nombre: "Monitor Dell UltraSharp",
      precioVenta: "$499.99",
      stock: 5,
    },
    {
      id: 4,
      nombre: "Laptop HP Spectre x360",
      precioVenta: "$1,299.99",
      stock: 3,
    },
    {
      id: 5,
      nombre: "Auriculares Sony WH-1000XM4",
      precioVenta: "$349.99",
      stock: 10,
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    console.log("Producto eliminado:", productId);
    // Eliminar producto de la lista
    setProducts(products.filter(p => p.id !== productId));
    setDeleteModalOpen(false);
  };

  const handleSaveProduct = (productData) => {
    if (modalMode === 'edit') {
      // Actualizar producto existente
      console.log("Producto actualizado:", productData);
      setProducts(products.map(p => 
        p.id === productData.id ? productData : p
      ));
    } else {
      // Agregar nuevo producto
      console.log("Nuevo producto agregado:", productData);
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1, // Genera un nuevo ID
        ...productData
      };
      setProducts([...products, newProduct]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 relative">
        <h2 className="text-xl font-bold text-gray-800">Productos</h2>

        {/* Botón agregar producto en la esquina derecha */}
        <button
          className="flex absolute -top-3 right-0 mt-2 mr-4 bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700"
          onClick={handleOpenAddModal}
        >
          <div className="flex items-center justify-center bg-white rounded-full h-8 w-8 shadow-lg mr-2 ">
            <PlusIcon className="h-4 w-4 text-gray-600" />
          </div>
          Agregar Producto
        </button>

        {/* Buscador centrado */}
        <div className="relative mt-2 sm:mt-0 w-full sm:w-96 mx-auto">
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-5 py-2">Nombre</th>
              <th className="px-5 py-2">Precio Venta</th>
              <th className="px-5 py-2">Stock</th>
              <th className="px-5 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 text-sm">{product.id}</td>
                <td className="px-4 py-3">{product.nombre}</td>
                <td className="px-4 py-3">{product.precioVenta}</td>
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
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal compartido para agregar y editar productos */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
        mode={modalMode}
      />

      {/* Modal para eliminar producto */}
      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        product={selectedProduct}
        onDelete={() => handleDeleteProduct(selectedProduct?.id)}
      />
    </div>
  );
}