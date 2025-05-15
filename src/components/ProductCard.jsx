import { useState, useEffect } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

// Hook reutilizable para cargar imágenes de producto
function useProductImages(imageIds) {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchImageUrls = async () => {
      setIsLoading(true);
      const ids = Array.isArray(imageIds) ? imageIds.filter(Boolean) : [];

      if (ids.length === 0) {
        if (isMounted) setImageUrls(['/placeholder-image.jpg']);
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const urls = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await fetch(`http://localhost:5000/api/images/${id}`, {
                method: 'GET',
              }
              );
              if (!res.ok) return '/placeholder-image.jpg';
              const data = await res.json();
              return data.url || '/placeholder-image.jpg';
            } catch {
              return '/placeholder-image.jpg';
            }
          })
        );

        const valid = urls.filter(u => u !== '/placeholder-image.jpg');
        if (isMounted) {
          setImageUrls(valid.length ? valid : ['/placeholder-image.jpg']);
        }
      } catch {
        if (isMounted) setImageUrls(['/placeholder-image.jpg']);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchImageUrls();
    return () => {
      isMounted = false;
    };
  }, [imageIds]);

  return { imageUrls, isLoading };
}

const ProductCard = ({ producto }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { imageUrls, isLoading: isLoadingImages } = useProductImages(producto?.images_path);

  // Ciclar imágenes mientras se hace hover
  useEffect(() => {
    if (!isLoadingImages && isHovered && imageUrls.length > 1) {
      const id = setInterval(() => {
        setCurrentImageIndex(i => (i + 1) % imageUrls.length);
      }, 1500); // Cambia cada 3 segundos
      return () => clearInterval(id);
    }
  }, [isHovered, isLoadingImages, imageUrls]);

  if (!producto) return null;

  return (
    <div 
      className="relative border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white w-90"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de imágenes */}
      <div className="relative h-48 overflow-hidden">
        {isLoadingImages ? (
          <div className="absolute w-full bg-gray-200 animate-pulse"></div>
        ) : (
          imageUrls.map((img, index) => (
            (index === currentImageIndex ? (
              <div key={index} className="image h-full flex items-center justify-center">
                <img
                  src={img}
                  alt={producto.name || "Producto sin nombre"}
                  className="absolute w-full object-cover"
                  // onError={(e) => {
                  //   e.target.src = '/placeholder-image.jpg';
                  // }}
                />
              </div>
            ) : null)
          ))
        )}
        
        {/* Indicadores del carrusel */}
        {!isLoadingImages && imageUrls.length > 1 && (
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
          <span className="absolute top-3 left-3 bg-white text-violet-700 text-xs font-semibold px-2 py-1 rounded shadow-lg">
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
              ${producto.price ? Number(producto.price).toFixed(2) : "0.00"}
            </span>
          </div>
          
          <span className={`text-xs text-white px-2 py-1 rounded-full ${
            producto.stock > 10 
              ? "bg-gradient-to-r from-violet-600 to-violet-400" 
              : producto.stock > 0 
                ? "bg-gradient-to-r from-violet-500 to-violet-300" 
                : "bg-gradient-to-r from-gray-500 to-gray-400"
          }`}>
            {producto.stock > 0 ? `${producto.stock} en stock` : "Agotado"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;