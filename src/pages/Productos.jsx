import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import EditProductModal from "../components/EditProductModal";
import DeleteProductModal from "../components/DeleteProductModal";
// import AddProductModal from "../components/AddProductModal";
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

  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const filteredProducts = initialProducts.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (productId) => {
    console.log("Producto eliminado:", productId);
    // Lógica para eliminar producto de la lista real
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedProduct) => {
    console.log("Producto actualizado:", updatedProduct);
    // Lógica para actualizar producto en la lista real
  };
  const handleSaveProduct = (product) => {
    console.log("Nuevo producto agregado:", product);
    // Aquí puedes manejar la lógica para guardar el producto
  };
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 relative">
        <h2 className="text-xl font-bold text-gray-800">Productos</h2>

        {/* Botón agregar producto en la esquina derecha */}
        <button
          className=" flex absolute -top-3 right-0 mt-2 mr-4 bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700"
          onClick={() => setAddModalOpen(true)}
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
                    onClick={() => handleEdit(product)}
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

      <EditProductModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        product={selectedProduct}
        onSave={handleSaveEdit}
      />
      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        product={selectedProduct}
        onDelete={handleDelete}
      />
      {/* <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveProduct}
      /> */}
    </div>
  );
}
