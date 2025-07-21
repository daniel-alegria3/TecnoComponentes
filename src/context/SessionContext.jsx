import React, { useState, useEffect, useContext, createContext } from "react";

const SessionContext = createContext({
  isLoggedIn: null,
  doRegister: () => {},
  doLogin: () => {},
  doLogout: () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const queryLogin = async () => {
      try {
        const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/clients/logged_in`, {
          method: "GET",
          credentials: "include",
        });

        const rpta = await res.json();

        if (!res.ok) {
          throw new Error(rpta.error);
        }

        setIsLoggedIn(rpta.loggedIn);
      } catch (err) {
        console.log(err.message || "Error obteniendo informacion del login");
      }
    };

    queryLogin();
  }, []);

  const doRegister = async (firstName, lastName, email, password) => {
    try {
      // Hash the password before sending (SHA-256)
      const hashedPassword = await hashPassword(password);

      const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/clients/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName,
          surname: lastName,
          mail: email,
          password: hashedPassword, // Send the hashed password instead of plain text
        }),
      });

      const rpta = await res.json();

      if (!res.ok) {
        throw new Error(rpta.error);
      }

      setIsLoggedIn(rpta.loggedIn);
    } catch (err) {
      throw err;
    }
  };

  const doLogin = async (email, password) => {
    try {
      // Hash the password before sending (SHA-256)
      const hashedPassword = await hashPassword(password);

      const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/clients/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail: email,
          password: hashedPassword, // Send hashed password instead of plain text
        }),
      });

      const rpta = await res.json();

      if (!res.ok) {
        throw new Error(rpta.error);
      }
      
      setIsLoggedIn(rpta.loggedIn);
      if (rpta.loggedIn) {
        console.log("Login exitoso");
        setUserEmail(email); // Guardamos el email usado para login
        localStorage.setItem("userEmail", email); // Opcional: Persistir
        console.log("Email guardado en localStorage:", email);
      }
    } catch (err) {
      throw err;
    }
  };

  const doLogout = async () => {
    try {
      const res = await fetch(`http://${import.meta.env.VITE_APP_IP}:5000/api/clients/logout`, {
        method: "POST",
        credentials: "include",
      });

      const rpta = await res.json();

      if (!res.ok) {
        throw new Error(rpta.error);
      }

      setIsLoggedIn(rpta.loggedIn);
      setUserEmail(null); // Limpiamos el email
      localStorage.removeItem('userEmail'); // Opcional: Limpiar persistencia
    } catch (err) {
      throw err;
    }
  };

  // Helper function to hash passwords (SHA-256)
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  return (
    <SessionContext.Provider
      value={{ isLoggedIn, userEmail, doRegister, doLogin, doLogout }}
    >
      {children}
    </SessionContext.Provider>
  );
}
