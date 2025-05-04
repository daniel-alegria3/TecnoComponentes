// src/layouts/AdminLayout.jsx
import { Outlet, Link } from 'react-router-dom'
import NavbarAdmin from '../components/NavbarAdmin' // Asegúrate de que la ruta sea correcta

function AdminLayout() {
  return (
    <>
    <div>
      <NavbarAdmin />
      <hr />
      <Outlet />
    </div>
    </>
  )
}

export default AdminLayout
