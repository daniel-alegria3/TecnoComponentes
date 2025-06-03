import { useState, useEffect } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [shippingCost, setShippingCost] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

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

  const removeItem = (id) => {
    setCartItems((items) =>
      items.filter((it) => it.product.id_product !== id)
    );
  };

  const handleShipping = (e) => {
    const val = e.target.value;
    setShippingCost(val === "express" ? 4.99 : 0);
  };

  const applyPromo = () => {
    // placeholder: aquí podrías validar promo y ajustar total
    console.log("Aplicar código:", promoCode);
  };

  // recomendaciones estáticas
  const recommended = [
    {
      id_product: 201,
      name: "Teclado Corsair K68 RGB",
      price: 99,
      images_path: [""],
    },
    {
      id_product: 202,
      name: "Kingston Fury DDR5 32GB",
      price: 139,
      images_path: [""],
    },
    {
      id_product: 203,
      name: "Logitech G502 Lightspeed",
      price: 119,
      images_path: [""],
    },
  ];

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
      return [...items, { product: prod, quantity: 1 }];
    });
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">Tu Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">
              Tu carrito está vacío.
            </p>
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
                      onClick={() =>
                        updateQty(product.id_product, -1)
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() =>
                        updateQty(product.id_product, +1)
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-700">
                    €{product.price.toFixed(2)}
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
          <button className="w-full bg-orange-500 text-white py-3 rounded">
            Tramitar Pedido
          </button>
        </div>
      </div>

      {/* Recomendaciones */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quizás te interese</h2>
        <div className="flex flex-wrap gap-4">
          {recommended.map((prod) => (
            <div
              key={prod.id_product}
              className="bg-white p-4 rounded-lg shadow w-44"
            >
              <img
                src={prod.images_path[0] || "/placeholder.png"}
                alt={prod.name}
                className="w-full h-24 object-cover rounded mb-2"
              />
              <h3 className="font-medium text-sm mb-1">{prod.name}</h3>
              <p className="text-gray-700 mb-2">€{prod.price}</p>
              <button
                onClick={() => addRecommended(prod)}
                className="w-full bg-blue-600 text-white py-1 rounded text-sm"
              >
                Añadir
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}