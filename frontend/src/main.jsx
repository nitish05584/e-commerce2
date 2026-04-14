import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider'
import { UserProvider } from './context/UserContext'
import { ProductProvider } from './context/ProductContext'

export const server="http://localhost:8080"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
  
      </UserProvider>

    </ThemeProvider>

  </StrictMode>,
)
