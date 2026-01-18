import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './app/cart'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { CheckoutPage } from './pages/CheckoutPage'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/producto/:productId" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

