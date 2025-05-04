// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/NavbarCliente"; // Importa tu Navbar real
import Footer from "../components/Footer"; // Importa tu Footer real
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <hr />

      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
    </div>
  );
}

export default MainLayout;
