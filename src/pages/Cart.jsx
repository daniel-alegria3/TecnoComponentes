import { useState, useEffect, useRef, useContext } from "react";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";


export default function Cart() {
  const navigate = useNavigate();

  // 1) Sustituye useState por useContext
  const { cartItems, setCartItems } = useContext(CartContext);

  const [shippingCost, setShippingCost] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  // Efecto para el auto-scroll
  useEffect(() => {
    if (!scrollContainerRef.current || recommended.length === 0) return;

    const scrollContainer = scrollContainerRef.current;
    let animationId;
    let isUserScrolling = false;
    let userScrollTimeout;
    let lastTimestamp = 0;

    const scrollSpeed = 30; // Pixeles por segundo
    const pauseAfterUserScroll = 0; // Pausa 2 segundos después de que el usuario interactúe

    const autoScroll = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;

      if (!isUserScrolling) {
        // Calcular cuánto mover basado en el tiempo transcurrido
        const scrollDistance = (scrollSpeed * deltaTime) / 1000;

        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth - 1
        ) {
          // Si llegamos al final, volvemos al inicio suavemente
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += scrollDistance;
        }
      }

      lastTimestamp = timestamp;
      animationId = requestAnimationFrame(autoScroll);
    };

    // Detectar cuando el usuario está haciendo scroll manualmente
    const handleUserScroll = () => {
      isUserScrolling = true;

      // Cancelar timeout anterior si existe
      clearTimeout(userScrollTimeout);

      // Reanudar auto-scroll después de un tiempo
      userScrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, pauseAfterUserScroll);
    };

    // Pausar auto-scroll cuando el mouse está sobre el container
    const handleMouseEnter = () => {
      isUserScrolling = true;
    };

    const handleMouseLeave = () => {
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 500); // Breve pausa antes de reanudar
    };

    // Iniciar auto-scroll
    animationId = requestAnimationFrame(autoScroll);

    // Agregar event listeners
    scrollContainer.addEventListener('scroll', handleUserScroll);
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(userScrollTimeout);
      scrollContainer.removeEventListener('scroll', handleUserScroll);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [recommended]);

  // Obtener productos recomendados
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/clients/getproducts");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setRecommended(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching recommended products:", err);
        setError("No se pudieron cargar las recomendaciones");
        setRecommended([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  // Calcular subtotal y total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  // 2) updateQty usa setCartItems del contexto
  const updateQty = (id, delta) => {
    setCartItems((items) =>
      items
        .map((it) =>
          it.product.id_product === id
            ? { ...it, quantity: Math.max(1, it.quantity + delta) }
            : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const removeItem = (id) =>
    setCartItems((items) => items.filter((it) => it.product.id_product !== id));

  const handleShipping = (e) => {
    const val = e.target.value;
    setShippingCost(val === "express" ? 4.99 : 0);
  };

  const applyPromo = () => {
    // placeholder: aquí podrías validar promo y ajustar total
    console.log("Aplicar código:", promoCode);
  };

  const addRecommended = (prod) => {
    setCartItems((items) => {
      const exists = items.find(
        (it) => it.product.id_product === prod.id_product
      );
      if (exists) {
        return items.map((it) =>
          it.product.id_product === prod.id_product
            ? { ...it, quantity: it.quantity + 1 }
            : it
        );
      }
      return [
        ...items,
        {
          product: prod,
          quantity: 1,
        },
      ];
    });
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">Tu Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Tu carrito está vacío.</p>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div
                key={product.id_product}
                className="bg-white p-4 rounded-lg shadow flex items-center"
              >
                <img
                  src={product.images_path[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 px-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-gray-500 text-sm truncate">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(product.id_product, -1)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => updateQty(product.id_product, +1)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-700">
                    €{product.price}
                  </p>
                  <p className="font-semibold">
                    €{(product.price * quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(product.id_product)}
                  className="ml-4 text-red-500"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Resumen del Pedido */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">Resumen del Pedido</h2>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span className="block mb-1">Envío</span>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={shippingCost === 0}
                onChange={handleShipping}
              />
              Estándar (Gratis)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shippingCost === 4.99}
                onChange={handleShipping}
              />
              Express (€4.99)
            </label>
          </div>
          <div>
            <input
              type="text"
              placeholder="Código promocional"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <button
              onClick={applyPromo}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Aplicar
            </button>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <button
            onClick={() =>  navigate("/sales")}
            className="w-full bg-orange-500 text-white py-3 rounded"
          >
            Tramitar Pedido
          </button>
        </div>
      </div>

      {/* Recomendaciones con auto-scroll */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quizás te interese</h2>
        {loading ? (
          <p>Cargando recomendaciones...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="relative group">
            {/* Contenedor del carrusel */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-4 scrollbar-hide gap-4"
            >
              {recommended.map((producto) => (
                <div key={producto.id_product} className="flex-shrink-0 w-90">
                  <ProductCard
                    producto={{
                      id_product: producto.id_product,
                      name: producto.name || "Producto sin nombre",
                      description: producto.description || "",
                      stock: producto.stock || 0,
                      category: producto.category || "Sin categoría",
                      brand: producto.brand || "Sin marca",
                      price: Number(producto.price || 0),
                      images_path: producto.images_path ? producto.images_path : ["/placeholder.png"],
                    }}
                    onAddToCart={() => addRecommended(producto)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
