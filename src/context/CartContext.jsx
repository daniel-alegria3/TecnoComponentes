import React, { useState, useEffect, createContext, useContext } from "react";

const CartContext = createContext({
  cartItems: [],
  addProdToCart: () => {},
  updateProdFromCart: () => {},
  removeProdFromCart: () => {},
});

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [anyError, setAnyError] = useState("");
  // TODO: recuperar del database esta informacion
  let PRODUCT_STOCK_AVAILABLE = 10;

  useEffect(() => {
    const queryCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/clients/logged_in`, {
          method: "GET",
          credentials: 'include',
        });

        const rpta = await res.json();

        if (!res.ok) {
          throw new Error(rpta.error);
        }

        if (!rpta.loggedIn)
          return;

        // setCartItems(rpta.???);
      } catch (err) {
        setAnyError(err.message || "Error obteniendo informacion del login");
      }
    };

    queryCart();
  }, []);

  const addProdToCart = async(producto) => {
    setCartItems(items => {
      const exists = items.find(it => it.product.id_product === producto.id_product);
      if (exists) {
        return items.map(it => {
          let val = it.quantity; // no incrementes nada
          return it.product.id_product === producto.id_product
               ? { ...it, quantity: val }
               : it;
        });
      }

      return [...items, { product: producto, quantity: 1 }];
    });
  }

  const updateProdFromCart = async(producto, delta) => {
    let id = producto.id_product;
    setCartItems((items) =>
      items
      .map((it) => {
        let val;
        if (delta > PRODUCT_STOCK_AVAILABLE)
          val = it.quantity; // no incrementes nada
        else {
          val = Math.max(1, it.quantity + delta)
          PRODUCT_STOCK_AVAILABLE -= delta
        }
        return it.product.id_product === id
          ? { ...it, quantity: val }
          : it
      }).filter((it) => it.quantity > 0)
    );
  }

  const removeProdFromCart = (producto) => {
    let id = producto.id_product;
    setCartItems((items) => items.filter((it) => it.product.id_product !== id));
  }

  return (
    <CartContext.Provider value={{ cartItems, addProdToCart, updateProdFromCart, removeProdFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

