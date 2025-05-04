import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ClienteLayout from './layouts/ClienteLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import Ofertas from './pages/Ofertas'
import Productos from './pages/admin/Productos'

import './App.css'
import Dashboard from './pages/admin/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas con su layout */}
        <Route element={<ClienteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ofertas" element={<Ofertas />} />
        </Route>

        {/* Rutas admin con su layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path='/admin/' element={<Dashboard />} />
          <Route path="/admin/productos" element={<Productos />} />
        </Route>
      </Routes>
    </Router>
  )
}
export default App
