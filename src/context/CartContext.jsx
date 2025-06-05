import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {}
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res, rpta;

        res = await fetch(`http://localhost:5000/api/clients/logged_in`, {
          method: "GET",
          credentials: 'include',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error);
        }
        rpta = await res.json();

        if (!rpta.loggedIn)
          return;

        // res = await fetch(`http://localhost:5000/api/clients/logged_in`, {
        //   method: "GET",
        //   credentials: 'include',
        // });
        // if (!res.ok) {
        //   const errorData = await res.json();
        //   throw new Error(errorData.error);
        // }
        // rpta = await res.json();
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [cartItems]);


  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
}
