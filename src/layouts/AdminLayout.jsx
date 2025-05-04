// src/layouts/AdminLayout.jsx
import { Outlet, Link } from 'react-router-dom'
import NavbarAdmin from '../components/NavbarAdmin' // Asegúrate de que la ruta sea correcta

function AdminLayout() {
  return (
    <>
    <div>
      <NavbarAdmin />
      <hr />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
    </>
  )
}

export default AdminLayout
