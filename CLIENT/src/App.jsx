import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { useEffect } from "react"
import './App.css'
import Home from "./pages/Home"
import Usuario from "./pages/Usuario"
import Ingresar from "./pages/Ingresar"
import CrearCuenta from "./pages/CrearCuenta"
import NavbarApp from "./components/NavbarApp"
import Footer from "./components/Footer"
import Contacto from "./pages/Contacto"
import HorarioAtencion from "./pages/HorarioAtencion"
import SobreNosotros from "./pages/SobreNosotros"
import TerminosCondiciones from "./pages/TerminosCondiciones"
import ServiciosProductos from "./pages/ServicioProductos"
import ServicioProductoIndividual from "./pages/ServicioProductoIndividial"
import Carro from "./pages/Carro"
import CarroCheckout from "./pages/CarroCheckout"
import CarroSuccess from "./pages/CarroSuccess"
import ProtectedRoute from "./routes/ProtectedRoute"
import MisCompras from "./pages/MisCompras"
import MisFavoritos from "./pages/MisFavoritos"
import Clientes from "./pages/Clientes"
import Ventas from "./pages/Ventas"
import Productos from "./pages/Productos"

// Función para decodificar el token JWT 
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function App() {
  // Verificar expiración del token
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token')
      if (!token) return // Si no hay token, no hacer nada
      
      const decoded = decodeToken(token)
      
      // Si el token está mal formado o expiró
      if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
        // Limpiar todo el localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        
        // Redirigir al login
        window.location.href = '/Ingresar'
      }
    }
    
    // Verificar inmediatamente al cargar la app
    checkTokenExpiration()
    
    // Verificar cada 5 minutos (300000 ms)
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000)
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserRouter>
      <CartProvider>
        <NavbarApp />

        <Routes>
          <Route
            path="/Usuario"
            element={
              <ProtectedRoute>
                <Usuario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CarroCheckout"
            element={
              <ProtectedRoute rol={["Cliente", "Super"]}>
                <CarroCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CarroSuccess"
            element={
              <ProtectedRoute rol={["Cliente", "Super"]}>
                <CarroSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MisCompras"
            element={
              <ProtectedRoute rol={["Cliente", "Super"]}>
                <MisCompras />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MisFavoritos"
            element={
              <ProtectedRoute rol={["Cliente", "Super"]}>
                <MisFavoritos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute rol={["Super"]}>
                <Clientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventas"
            element={
              <ProtectedRoute rol={["Super"]}>
                <Ventas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute rol={["Super"]}>
                <Productos />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Home />} />
          <Route path="/Ingresar" element={<Ingresar />} />
          <Route path="/CrearCuenta" element={<CrearCuenta />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="/Horarios" element={<HorarioAtencion />} />
          <Route path="/Sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/Terminos" element={<TerminosCondiciones />} />
          <Route path="/ServiciosProductos" element={<ServiciosProductos />} />
          <Route path="/item/:id" element={<ServicioProductoIndividual />} />
          <Route path="/Carro" element={<Carro />} />

        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  )
  
}

export default App