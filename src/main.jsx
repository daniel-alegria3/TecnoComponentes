import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { SessionProvider } from './context/SessionContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
)

