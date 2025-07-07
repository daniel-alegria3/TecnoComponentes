import { Routes, Route } from "react-router-dom";
import { useAppLoading } from "./hooks/useAppLoading";
import LoadingScreen from "./components/LoadingScreen";

import ClienteLayout from "./layouts/ClienteLayout";
import AdminLayout from "./layouts/AdminLayout";

// CLIENTE
import Home from "./pages/Home";
import Ofertas from "./pages/Ofertas";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./components/ProductDetail";
import Cart from "./pages/Cart";
import Sales from "./pages/Sales";
import ArmaTuPC from "./pages/ArmaTuPC";

// ADMIN
import "./App.css";
import Dashboard from "./pages/admin/Dashboard";
import Productos from "./pages/admin/Productos";

function App() {
  const { isLoading, loadingProgress } = useAppLoading();

  // Si está cargando, mostrar loading screen
  if (isLoading) {
    return <LoadingScreen externalProgress={loadingProgress} onLoadingComplete={() => {}} />;
  }

  // Si no está cargando, mostrar la aplicación normal
  return (
    <Routes>
      {/* Rutas públicas con su layout */}
      <Route element={<ClienteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/arma-tu-pc" element={<ArmaTuPC />} />
      </Route>

      {/* Rutas admin con su layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/" element={<Dashboard />} />
        <Route path="/admin/productos" element={<Productos />} />
      </Route>
    </Routes>
  );
}

export default App;
