import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, rol }) {
  let usuario = null
  const storedUser = localStorage.getItem("usuario")

  try {
    if (storedUser && storedUser !== "undefined") {
      usuario = JSON.parse(storedUser)
    }
  } catch (e) {
    console.error("Usuario corrupto en localStorage")
    localStorage.removeItem("usuario")
  }

  // No hay sesión
  if (!usuario) {
    return <Navigate to="/ingresar" replace />
  }

  // Hay rol requerido y no coincide
  if (rol && !rol.includes(usuario.rol)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
