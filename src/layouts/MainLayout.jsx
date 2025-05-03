// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/NavbarCliente'; // Importa tu Navbar real

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <hr />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-800 p-4 text-center text-white">
        © 2025 MiEcommerce — Todos los derechos reservados
      </footer>
    </div>
  );
}

export default MainLayout;
