import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
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


function App() {
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