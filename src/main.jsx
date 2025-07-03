import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { SessionProvider } from './context/SessionContext'
import { ProductsProvider } from './context/ProductsContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProductsProvider>
      <CartProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
      </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>
)

