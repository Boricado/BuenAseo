import { Container, Form, Button, Table } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { CartContext } from "../context/CartContext"

function CarroCheckout() {
  const navigate = useNavigate()
  // llamar al carro
  const { carroItems, total, setCarroItems } = useContext(CartContext)
  
  const [datos, setDatos] = useState({ 
    nombre: "", 
    direccion: "", 
    metodo_pago: "" 
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const token = localStorage.getItem("token")

    try {
      const response = await fetch("http://localhost:3000/api/ventas/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: datos.nombre,
          direccion: datos.direccion,
          metodo_pago: datos.metodo_pago,
          items: carroItems,
          total: total
        })
      })

      const resData = await response.json()

      if (response.ok && resData.ok) {
        // Guardar éxito antes de limpiar
        const idVentaFinal = resData.ventaId
        const totalFinal = total

        // Limpiar carro
        if (setCarroItems) {
          setCarroItems([])
        }
        
        // ir a pagina de success
        navigate("/CarroSuccess", { 
          state: { 
            idVenta: idVentaFinal, 
            total: totalFinal 
          } 
        })
      } else {
        alert("Error: " + (resData.error || "No se pudo procesar"))
      }
    } catch (err) {
      console.error("Error detallado en el Checkout:", err)
      alert("Error de conexión. Revisa la consola.")
    }
  }

  return (
    <Container className="py-5">
      <h3 className="mb-4">Finaliza tu compra</h3>
      
      <Table bordered hover className="mb-4">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {carroItems.map((item, idx) => (
            <tr key={item.id || idx}>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
              <td>${Number(item.precio).toLocaleString("es-CL")}</td>
              <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h5 className="text-end mb-4">Total a pagar: ${total.toLocaleString("es-CL")}</h5>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control 
            type="text" 
            required 
            placeholder="Ej: Juan Pérez"
            value={datos.nombre}
            onChange={(e) => setDatos({...datos, nombre: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Dirección del servicio / despacho</Form.Label>
          <Form.Control 
            type="text" 
            required 
            placeholder="Calle, Número, Comuna"
            value={datos.direccion}
            onChange={(e) => setDatos({...datos, direccion: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Forma de pago</Form.Label>
          <Form.Select 
            required 
            value={datos.metodo_pago}
            onChange={(e) => setDatos({...datos, metodo_pago: e.target.value})}
          >
            <option value="">Selecciona una opción</option>
            <option value="Transferencia">Transferencia Electrónica</option>
            <option value="Tarjeta">Tarjeta de Débito / Crédito</option>
            <option value="Efectivo">Efectivo</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="success" className="w-100 py-2 fw-bold">
          Confirmar y Pagar
        </Button>
      </Form>
    </Container>
  )
}

export default CarroCheckout