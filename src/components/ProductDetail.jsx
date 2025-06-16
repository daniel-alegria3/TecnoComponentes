import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import { Link } from 'react-router-dom';
import { ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CartContext } from "../context/CartContext";
import useProductImages from '../composables/useProductImages';

export default function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const { cartItems, setCartItems } = useContext(CartContext);

  const { imageUrls, isImagesLoading } = useProductImages(producto?.images_path || []);

  const handleAddToCart = e => {
    e.stopPropagation();
    setCartItems(items => {
      const exists = items.find(it => it.product.id_product === producto.id_product);
      if (exists) {
        return items.map(it =>
          it.product.id_product === producto.id_product
            ? { ...it, quantity: it.quantity + 1 }
            : it
        );
      }
      return [...items, { product: producto, quantity: 1 }];
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        if (!response.ok) throw new Error("Producto no encontrado");
        const data = await response.json();
        if (isMounted) {
          setProducto(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ... rest of your component remains exactly the same ...

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-violet-50">
        <div className="text-violet-700 font-medium">
          Cargando detalles del producto...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-violet-50">
        <div className="text-red-500 bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
          <p className="text-lg font-semibold mb-4">Error: {error}</p>
          <Link
            to="/"
            className="inline-flex items-center bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );

  if (!producto)
    return (
      <div className="min-h-screen flex items-center justify-center bg-violet-50">
        <div className="text-violet-800 bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
          <Link
            to="/"
            className="inline-flex items-center bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Explorar productos
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-violet-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-violet-600 hover:text-violet-800 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Volver a todos los productos
        </Link>

        {/* Main product section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image gallery */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="bg-violet-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
                {isImagesLoading ? (
                  <div className="w-32 h-32 border-4 border-dashed rounded-full border-gray-300 animate-spin"></div>
                ) : (
                  <img
                    src={
                      imageUrls[mainImageIndex] || "/placeholder-product.jpg"
                    }
                    alt={producto.name}
                    className="w-full h-full object-contain"
                    // onError={(e) => {
                    //   e.target.src = '/placeholder-product.jpg';
                    // }}
                  />
                )}
              </div>

              {/* Thumbnail images */}
              {!isImagesLoading && imageUrls.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {imageUrls.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImageIndex(index)}
                      className={`bg-violet-50 rounded-md overflow-hidden border-2 transition-all ${
                        index === mainImageIndex
                          ? "border-violet-600"
                          : "border-violet-200 hover:border-violet-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${producto.name} ${index + 1}`}
                        className="w-full h-24 object-cover"
                        // onError={(e) => {
                        //   e.target.src = "/placeholder-product.jpg";
                        // }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="space-y-6">
              {/* Title and category */}
              <div>
                <span className="inline-block bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide mb-2">
                  {producto.category}
                </span>
                <h1 className="text-3xl font-bold text-violet-900">
                  {producto.name}
                </h1>
                <p className="text-violet-600 font-medium">{producto.brand}</p>
              </div>

              {/* Price and availability */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-violet-700">
                  ${Number(producto.price).toFixed(2)}
                </span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    producto.stock > 10
                      ? "bg-green-100 text-green-800"
                      : producto.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {producto.stock > 0
                    ? `${producto.stock} disponibles`
                    : "Agotado"}
                </span>
              </div>

              {/* Description */}
              <div className="border-t border-violet-100 pt-4">
                <h2 className="text-xl font-semibold text-violet-800 mb-3">
                  Descripción
                </h2>
                <p className="text-violet-700 leading-relaxed whitespace-pre-line">
                  {producto.description || "No hay descripción disponible."}
                </p>
              </div>

              {/* Specifications */}
              {producto.specs && (
                  <div className="border-t border-violet-100 pt-4">
                    <h2 className="text-xl font-semibold text-violet-800 mb-3">
                      Especificaciones
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-violet-700">
                      {Object.entries(producto.specs).map(([key, value]) => {
                        // Format the key (capitalize first letter, replace underscores)
                        const formattedKey = key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase());

                        // Handle different value types
                        let displayValue;
                        if (value === null || value === undefined) {
                          displayValue = "-";
                        } else if (typeof value === "object") {
                          displayValue = JSON.stringify(value);
                        } else if (Array.isArray(value)) {
                          displayValue = value.join(", ");
                        } else {
                          displayValue = String(value);
                        }

                        return (
                          <li key={key} className="flex">
                            <span className="font-medium text-violet-800 min-w-[120px]">
                              {formattedKey}:
                            </span>
                            <span className="ml-2">{displayValue}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={producto.stock <= 0}
                  className={`flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-colors shadow-md ${
                    producto.stock > 0
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  Añadir al carrito
                </button>
                <button
                  disabled={producto.stock <= 0}
                  className={`py-3 px-6 rounded-lg font-medium transition-colors border ${
                    producto.stock > 0
                      ? "border-violet-600 text-violet-600 hover:bg-violet-50"
                      : "border-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Comprar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
