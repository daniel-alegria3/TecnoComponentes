import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permite acceso desde la red local
    port: 5173, // Puerto del frontend (opcional, 5173 es el predeterminado)
    strictPort: true, // Evita que Vite cambie el puerto si está ocupado
  },
});
