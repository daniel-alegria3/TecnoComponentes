import React, { useState, useEffect, useMemo } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useProductImages from '../composables/useProductImages';
import { useSession } from "../context/SessionContext";
import { useProduct } from "../context/ProductsContext";

export default function ProductCard({ producto, productoID = null, onSelect, isSelected, view }) {
  let [prod, setProduct] = useProduct(productoID);
  const product = productoID ? prod : producto;

  const { addProdToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = useMemo(() => product?.images_path ?? [], [product]);
  const { imageUrls, isImagesLoading } = useProductImages(images);
  const { isLoggedIn } = useSession();

  // Ciclar imágenes mientras se hace hover
  useEffect(() => {
    if (!isImagesLoading && isHovered && imageUrls.length > 1) {
      const id = setInterval(() => {
        setCurrentImageIndex(i => (i + 1) % imageUrls.length);
      }, 1500); // Cambia cada 3 segundos
      return () => clearInterval(id);
    }
  }, [isHovered, isImagesLoading, imageUrls]);

  const handleAddToCart = async e => {
    e.stopPropagation();
    const available_stock = await addProdToCart(product);
    if (available_stock != null) {
      if (productoID) {
        setProduct({available_stock: available_stock});
      } else {
        product.available_stock = available_stock;
      }
    }
  };

  if (!product) return null;

  const isCompact = view === 'compact';

  const cardClasses = `
    relative border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white
    ${isCompact ? 'w-full h-auto' : 'w-90 h-85'}
    ${onSelect ? 'cursor-pointer' : ''}
    ${isSelected ? 'border-violet-500 ring-2 ring-violet-500' : 'border-gray-200'}
  `;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de imágenes (para seleccionar) */}
      <div
        className={`relative overflow-hidden ${isCompact ? 'h-32' : 'h-48'} ${onSelect ? 'cursor-pointer' : ''}`}
        onClick={onSelect ? handleCardClick : undefined}
      >
        <div className="image h-full flex items-center justify-center bg-gray-100">
          {isImagesLoading ? (
            <div className="w-32 h-32 border-4 border-dashed rounded-full border-gray-300 animate-spin"></div>
          ) : imageUrls.length > 0 ? (
            imageUrls.map((img, index) =>
              index === currentImageIndex ? (
                <img
                  key={index}
                  src={img}
                  alt={product.name || "Producto sin nombre"}
                  className="absolute w-full object-cover"
                />
              ) : null
            )
          ) : (
            <img
              src="/Logo.png"
              alt="Producto sin imagen"
              className="h-32 w-32 object-contain"
            />
          )}
        </div>

        {/* Overlay de selección para la vista compacta */}
        {isCompact && isHovered && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 pointer-events-none">
            <span className="bg-white text-violet-700 font-semibold px-4 py-2 rounded-lg shadow-md">
              Seleccionar
            </span>
          </div>
        )}

        {/* Indicadores del carrusel */}
        {!isImagesLoading && imageUrls.length > 1 && !isCompact && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {imageUrls.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                aria-label={`Mostrar imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Botón de añadir al carrito */}
        {isLoggedIn && !isCompact && (
          <button
            onClick={handleAddToCart}
            className={`absolute top-3 right-3 bg-gradient-to-r from-violet-600 to-violet-400 text-white p-2.5 rounded-full shadow-lg transform transition-all duration-300 hover:from-violet-700 hover:to-violet-500 ${
              isHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            aria-label="Añadir al carrito"
          >
            <ShoppingBagIcon className="h-5 w-5" />
          </button>
        )}

        {/* Etiqueta de categoría */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white text-violet-700 text-xs font-semibold px-2 py-1 rounded shadow-lg">
            {product.category}
          </span>
        )}
      </div>

      {/* Contenido de la card (para ver detalles) */}
      <div className="relative">
        <Link to={`/product/${product.id_product}`} className="block">
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <h4 className={`font-semibold text-gray-800 truncate ${isCompact ? 'text-base' : 'text-lg'}`}>
                {product.name || "Producto sin nombre"}
              </h4>
              {product.brand && (
                <span className="text-xs text-gray-500">{product.brand}</span>
              )}
            </div>

            <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${isCompact ? 'h-auto' : 'h-10'}`}>
              {product.description || "Descripción no disponible."}
            </p>

            <div className="flex justify-between items-center">
              <div>
                <span className={`font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent ${isCompact ? 'text-lg' : 'text-xl'}`}>
                  ${product.price ? Number(product.price).toFixed(2) : "0.00"}
                </span>
              </div>

              <span className={`text-xs text-white px-2 py-1 rounded-full ${
                product.available_stock > 10
                  ? "bg-gradient-to-r from-violet-600 to-violet-400"
                  : product.available_stock > 0
                    ? "bg-gradient-to-r from-violet-500 to-violet-300"
                    : "bg-gradient-to-r from-gray-500 to-gray-400"
              }`}>
                {product.available_stock > 0 ? `${product.available_stock} en stock` : "Agotado"}
              </span>
            </div>
          </div>
          {/* Overlay para "Ver Detalles" en vista compacta */}
          {isCompact && isHovered && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 pointer-events-none">
              <span className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-md">
                Ver Detalles
              </span>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};
