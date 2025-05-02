import React, { useState, useEffect } from "react";
import {
 MagnifyingGlassIcon,
 PencilIcon,
 TrashIcon,
 PlusIcon,
} from "@heroicons/react/24/outline";
import ProductModal from "../components/ProductModal";
import DeleteProductModal from "../components/DeleteProductModal";


export default function Productos() {
 const [products, setProducts] = useState([]);
 const [search, setSearch] = useState("");
 const [productModalOpen, setProductModalOpen] = useState(false);
 const [selectedProduct, setSelectedProduct] = useState(null);
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [modalMode, setModalMode] = useState("add"); // 'add' o 'edit'
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);


 useEffect(() => {
   setLoading(true);
   setError(false); // Reseteamos el error cada vez que hacemos fetch


   fetch("http://localhost:5000/api/products")
     .then((response) => response.json())
     .then((data) => {
       if (Array.isArray(data)) {
         setProducts(data); // Solo establecemos productos si data es un array
       } else {
         console.error("Respuesta inesperada:", data);
         setProducts([]); // Aseguramos que sea un array vacío en caso de respuesta incorrecta
         setError(true);
       }
     })
     .catch((err) => {
       console.error("Error: ", err);
       setError(true); // Solo marcamos que hubo error, no guardamos el mensaje
     })
     .finally(() => {
       setLoading(false);
     });
 }, []);


 // Filtrar productos
 const filteredProducts = products.filter((p) =>
   p.name.toLowerCase().includes(search.toLowerCase())
 );


 // CRUD
 const addProduct = async (productData) => {
   try {
     const res = await fetch(`http://localhost:5000/api/products`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(productData),
     });


     const errorData = await res.json();
     if (!res.ok) {
       throw new Error(errorData.error);
     }


     let id = errorData.id_product;
     console.log("ID::::, ", errorData);
     return id;
   } catch (err) {
     console.error("Error:", err);
     alert("Error adding product");
   }
 };


 const deleteProduct = async (id) => {
   try {
     const res = await fetch(`http://localhost:5000/api/products/${id}`, {
       method: "DELETE",
     });


     if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.error);
     }


     // Remove item from list
     setProducts(products.filter((p) => p.id_product !== id));
   } catch (err) {
     console.error("Error:", err);
     alert("Error deleting product");
   }
 };


 const editProduct = async (productData) => {
   try {
     let id = productData.id_product;
     const res = await fetch(`http://localhost:5000/api/products/${id}`, {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(productData),
     });


     const errorData = await res.json();
     if (!res.ok) {
       throw new Error(errorData.error);
     }
   } catch (err) {
     console.error("Error:", err);
     alert("Error editing product");
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
   console.log("Producto eliminado:", productId);
   // Eliminar producto de la lista
   deleteProduct(productId);
   setProducts(products.filter((p) => p.id_product !== productId));
   setDeleteModalOpen(false);
 };


 const handleSaveProduct = (productData) => {
   if (modalMode === "edit") {
     // Actualizar producto existente
     console.log("Producto actualizado:", productData);
     editProduct(productData);
     setProducts(
       products.map((p) =>
         p.id_product === productData.id_product ? productData : p
       )
     );
     // setProducts([...products, productData]);
   } else {
     // Agregar nuevo producto
     console.log("Nuevo producto agregado:", productData);
     let new_id = addProduct(productData);
     productData.id_product = new_id;
     console.log("DATAAA: ", productData);
     console.log("ANADIDO: ", new_id);
     setProducts([...products, productData]);
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
               <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                 Cargando productos...
               </td>
             </tr>
           ) : error ? (
             <tr>
               <td colSpan="6" className="px-4 py-8 text-center text-red-600">
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
               <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                 No se encontraron productos.
               </td>
             </tr>
           ) : (
             filteredProducts.map((product) => (
               <tr key={product.id_product}>
                 <td className="px-4 py-3 text-sm">{product.id_product}</td>
                 <td className="px-4 py-3">{product.name}</td>
                 <td className="px-4 py-3">{product.brand}</td>
                 <td className="px-4 py-3">{product.price}</td>
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
       onDelete={() => handleDeleteProduct(selectedProduct?.id_product)}
     />
   </div>
 );
}
