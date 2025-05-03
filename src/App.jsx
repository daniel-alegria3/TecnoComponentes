import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import About from './pages/About'
import Productos from './pages/admin/Productos'

import './App.css'
import Dashboard from './pages/admin/Dashboard'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/message')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error("Error fetching message:", err));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas con su layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
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
