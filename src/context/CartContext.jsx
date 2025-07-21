import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { useProducts } from "./ProductsContext";

const CartContext = createContext({
  cartItems: [],
  addProdToCart: async() => {},
  updateProdFromCart: async() => {},
  removeProdFromCart: async() => {},
  initCartUserData: async() => {},
});

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const CART_PURCHASE_TIMEOUT_SECS = 1500;

  const [cartItems, setCartItems] = useState([]);
  const timer = useRef(null);
  const { refreshProducts } = useProducts();

  const initCartUserData = async () => {
    try {
      const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/clients/vercarrito/42069`, {
        method: "GET",
        credentials: 'include',
      });

      const rpta = await res.json();

      if (!res.ok) {
        throw new Error(rpta.error);
      }

      if (!rpta?.error) {
        let carrito = []
        if (Array.isArray(rpta)) {
          carrito = rpta.map(obj => {
            const { quantity, ...product } = obj;
            return {
              product: product,
              quantity: Number(quantity),
            };
          })
        }
        setCartItems(carrito);
      }
    } catch (err) {
      console.log("Error: ", err.message || "Error obteniendo informacion del Carrito")
      throw err;
    }
  };

  useEffect(() => {
    initCartUserData();
  }, []);

  ///[ DEBUG FUNCTION
  // useEffect(() => {
  //   console.log("=== RELOADED ============================\n")
  //   console.log(cartItems)
  //   console.log("=\n")
  // }, [cartItems]);
  ///[ END DEBUG FUNCTION

  const addProdToCart = async(producto) => {
    if (1 > producto.stock) return;
    const exists = cartItems.find(it => it.product.id_product === producto.id_product);
    if (exists) return null;

    await api_set_prod_to_cart(producto.id_product, 1);

    setCartItems(items => {
      return [...items, { product: {...producto}, quantity: 1 }];
    });

    // Refrescar productos para obtener el stock actualizado del servidor
    await refreshProducts();

    // Ya no calculamos el stock localmente, el backend lo maneja físicamente
    return null;
  }

  const updateProdFromCart = async(producto, delta) => {
    if (delta > producto.stock)
      return null;

    const item = cartItems.find(it => it.product.id_product == producto.id_product);
    if (item.quantity == 1 && delta < 0)
      return null;

    const safeQty = Math.max(1, item.quantity + delta);
    await api_set_prod_to_cart(producto.id_product, safeQty);

    setCartItems((items) =>
      items.map((it) => {
        if (it.product.id_product == producto.id_product) {
          return { product: {...producto}, quantity: safeQty };
        } else {
          return it;
        }
      }).filter((it) => it.quantity > 0)
    );

    // Refrescar productos para obtener el stock actualizado del servidor
    await refreshProducts();

    // Ya no calculamos el stock localmente, el backend lo maneja físicamente
    return null;
  }

  const removeProdFromCart = async(producto) => {
    const item = cartItems.find(it => it.product.id_product === producto.id_product);
    if (!item) return null;

    await api_del_prod_from_cart(producto.id_product);

    setCartItems((items) => items.filter((it) => it.product.id_product != producto.id_product));

    // Refrescar productos para obtener el stock actualizado del servidor
    await refreshProducts();

    // Ya no calculamos el stock localmente, el backend lo maneja físicamente
    return null;
  }

  //====================== {funciones (api) auxiliares} ========================
  const api_set_prod_to_cart = async(id_product, quantity) => {
    try {
      const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/clients/agregarcarrito`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_product: id_product,
          quantity: quantity,
        }),
      });

      const rpta = await res.json();

      if (!res.ok) {
        throw new Error(rpta.error);
      }

    } catch (err) {
      console.log(err.message || "Error: api call 'agregar_carrito'");
    }
  }

  const api_del_prod_from_cart = async(id_product) => {
    try {
      const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/clients/vaciarcarrito`, {
        method: "DELETE",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_product: id_product,
        }),
      });

      const rpta = await res.json();

      if (!res.ok) {
        throw new Error(rpta.error);
      }

    } catch (err) {
      console.log(err.message || "Error: api call 'vaciarcarrito'");
    }
  }

  //====================== {eventos con timer} ========================
  const on_cart_timeout = () => {
    console.log("EMPTIED CLIENT'S CART");
    cartItems.map((it) => {
      removeProdFromCart(it.product);
    })
    setCartItems([]);
    clearTimeout(timer.current);
  };

  const start_timer = () => {
    timer.current = setTimeout(() => {
      on_cart_timeout();
    }, CART_PURCHASE_TIMEOUT_SECS * 1000);
  };

  // resetear timer cuando se actualiza cartItems
  useEffect(() => {
    if (cartItems.length > 0) {
      start_timer();
    }
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addProdToCart, updateProdFromCart, removeProdFromCart, initCartUserData }}>
      {children}
    </CartContext.Provider>
  );
}

