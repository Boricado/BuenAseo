import { Container, Table, Button, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { useContext } from "react"

function Carro() {
  const { carroItems, eliminarItem, cambiarCantidad, total } = useContext(CartContext)

  // Carro vacio
  if (!carroItems || carroItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">
          <h4>Tu carro está vacío</h4>
          <p>Explora nuestro catálogo para añadir productos o servicios.</p>
          <Link to="/ServiciosProductos">
            <Button variant="primary">Ir al catálogo</Button>
          </Link>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h3 className="mb-4">Tu Carro</h3>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Item</th>
            <th className="text-center">Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carroItems.map(item => {
            const nombre = item?.nombre || "Cargando..."
            const precio = item?.precio || 0
            const cantidad = item?.cantidad || 1
            const id = item?.id || Math.random()

            return (
              <tr key={id}>
                <td>{nombre}</td>
                <td>
                  <div className="d-flex align-items-center justify-content-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => cambiarCantidad(id, cantidad - 1)}
                      disabled={cantidad <= 1}
                    >
                      -
                    </Button>
                    <span className="mx-3 fw-bold">{cantidad}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => cambiarCantidad(id, cantidad + 1)}
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td>${Number(precio).toLocaleString("es-CL")}</td>
                <td>${(precio * cantidad).toLocaleString("es-CL")}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarItem(id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <div className="d-flex flex-column align-items-end mt-4">
        <h4 className="fw-bold">Total: ${total?.toLocaleString("es-CL")}</h4>
        <Link to="/CarroCheckout" className="mt-3">
          <Button variant="primary" size="lg">Finalizar compra</Button>
        </Link>
      </div>
    </Container>
  )
}

export default Carro