import { createContext, useState, useEffect, useMemo } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [carroItems, setCarroItems] = useState([])
  const token = localStorage.getItem("token")

  // Cargar carro
  const cargarCarroDesdeDB = async () => {
    const activeToken = localStorage.getItem("token");
    if (!activeToken) return;

    try {
      const res = await fetch("https://buenaseo.onrender.com/api/carrito", {
        headers: { "Authorization": `Bearer ${activeToken}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setCarroItems(data)
      }
    } catch (error) {
      console.error("Error cargando carrito de la DB", error)
    }
  }

  useEffect(() => {
    cargarCarroDesdeDB()
  }, [])

  const agregarItem = async (item) => {
  const activeToken = localStorage.getItem("token")
  if (!activeToken) {
    alert("Inicia sesión para usar el carrito")
    return
  }

  const cantidadAgregar = item.cantidad ?? 1
  const tipo = item.id.startsWith("PRD") ? "Producto" : "Servicio"

  try {
    const res = await fetch("https://buenaseo.onrender.com/api/carrito", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${activeToken}`
      },
      body: JSON.stringify({
        id: item.id,
        cantidad: cantidadAgregar,
        tipo
      })
    })

    if (res.ok) {
      await cargarCarroDesdeDB()
    }
  } catch (error) {
    console.error("Error al agregar al carrito:", error)
  }
}


  // Eliminar item
  const eliminarItem = async (itemId) => {
    const activeToken = localStorage.getItem("token")
    try {
      const res = await fetch(`https://buenaseo.onrender.com/api/carrito/${itemId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${activeToken}` }
      })
      if (res.ok) {
        setCarroItems(prev => prev.filter(i => i.id !== itemId))
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
    }
  }

  // Cambiar Cantidades
  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return
    setCarroItems(prev => prev.map(i => i.id === id ? { ...i, cantidad: nuevaCantidad } : i))
  }

  // Actualizar el total
  const total = useMemo(() => {
    return carroItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
  }, [carroItems])

  return (
    <CartContext.Provider value={{ 
      carroItems, 
      setCarroItems, 
      agregarItem, 
      total,
      cargarCarroDesdeDB 
    }}>
      {children}
    </CartContext.Provider>
  )
}