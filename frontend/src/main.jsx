import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider'
import { UserProvider } from './context/UserContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'

export const server="https://e-commerce2-8v6l.onrender.com"

export const categories=[
  "smartphone",
  "laptop",
  "tshirt",
  "refrigerator",
  "headphones",
  "shoes",
  "watch",
  "camera",
  "tablet",
  "television",
  "sofa",
  "bed",
  "microwave",
  "air conditioner",
  "washing machine",
  "gaming console",
  "books",
  "toys",
  "kitchenware",
  "fitness equipment",
  "grocery",
  "accessories",
  "furniture",
  "stationery",
  "car accessories",
  "motercycle accessories",
  "sporting goods",
  "home decor",
  "healthcare products",
  "office supplies",
  "pet supplies",
  "power tools",
  "gradening tools",



]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <App />
          </CartProvider>
         
        </ProductProvider>
  
      </UserProvider>

    </ThemeProvider>

  </StrictMode>,
)
