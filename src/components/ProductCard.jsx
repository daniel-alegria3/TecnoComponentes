import { useState, useEffect } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

const ProductCard = ({ producto }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Asegurar que images_path siempre sea un array
  const images = producto?.images_path 
    ? Array.isArray(producto.images_path) 
      ? producto.images_path 
      : [producto.images_path]
    : ['/placeholder-image.jpg'];

  // Efecto para el carousel automático (mejorado)
  useEffect(() => {
    if (images.length <= 1) return; // No hacer nada si solo hay una imagen
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 3000); // Cambia cada 3 segundos

    // Limpieza del intervalo al desmontar
    return () => clearInterval(interval);
  }, [images.length]); // Dependencia correcta

  // Protección contra producto undefined
  if (!producto) return null;

  const getStockColor = (stock) => {
    if (!stock && stock !== 0) return "bg-gradient-to-r from-gray-500 to-gray-400";
    if (stock > 10) return "bg-gradient-to-r from-violet-600 to-violet-400";
    if (stock > 0) return "bg-gradient-to-r from-violet-500 to-violet-300";
    return "bg-gradient-to-r from-gray-500 to-gray-400";
  };

  return (
    <div 
      className="relative border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de imágenes */}
      <div className="relative w-full h-48 overflow-hidden group">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={producto.name || "Producto sin nombre"}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        ))}
        
        {/* Indicadores del carousel */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
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
        
        {/* Botón circular de añadir al carrito */}
        <button
          className={`absolute top-3 right-3 bg-gradient-to-r from-violet-600 to-violet-400 text-white p-2.5 rounded-full shadow-lg transform transition-all duration-300 hover:from-violet-700 hover:to-violet-500 ${
            isHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          aria-label="Añadir al carrito"
        >
          <ShoppingBagIcon className="h-5 w-5" />
        </button>
        
        {/* Etiqueta de categoría */}
        {producto.category && (
          <span className="absolute top-3 left-3 bg-white/90 text-violet-700 text-xs font-semibold px-2 py-1 rounded">
            {producto.category}
          </span>
        )}
      </div>
      
      {/* Contenido de la card */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold text-lg text-gray-800 truncate">
            {producto.name || "Producto sin nombre"}
          </h4>
          {producto.brand && (
            <span className="text-xs text-gray-500">{producto.brand}</span>
          )}
        </div>
        
        {producto.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {producto.description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
              ${producto.price ? producto.price.toFixed(2) : "0.00"}
            </span>
          </div>
          
          <span className={`text-xs text-white px-2 py-1 rounded-full ${getStockColor(producto.stock)}`}>
            {producto.stock > 0 ? `${producto.stock} en stock` : "Agotado"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;