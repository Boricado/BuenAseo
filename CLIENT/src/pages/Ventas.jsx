import { useEffect, useState } from "react"
import { Container, Table, Form, Badge, Modal, Button} from "react-bootstrap"

function Ventas() {
  const [ventas, setVentas] = useState([])
  const [ventaDetalle, setVentaDetalle] = useState(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    cargarVentas()
  }, [])

  const cargarVentas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/ventas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (data.ok) {
        setVentas(
          data.ventas.map(v => ({
            ...v,
            estado: v.estado || "Pendiente"
          }))
        )
      }
    } catch (error) {
      console.error("Error al cargar ventas", error)
    }
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/ventas/${id}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ estado: nuevoEstado })
        }
      )

      const data = await res.json()

      if (data.ok) {
        setVentas(
          ventas.map(v =>
            v.id === id ? { ...v, estado: nuevoEstado } : v
          )
        )
      }
    } catch (error) {
      console.error("Error al actualizar estado", error)
    }
  }

  const colorEstado = (estado) => {
    switch (estado) {
      case "Pendiente": return "warning"
      case "Pagado": return "success"
      case "En proceso": return "primary"
      case "Entregado": return "info"
      case "Cancelado": return "danger"
      default: return "secondary"
    }
  }

  return (
    <Container className="py-5">
      <h3 className="mb-4">Ventas realizadas</h3>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Pago</th>
            <th>Estado</th>
            <th>Detalle</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.cliente}</td>
              <td>
                {new Date(v.fecha).toLocaleDateString("es-CL")}
              </td>
              <td>
                ${Number(v.total).toLocaleString("es-CL")}
              </td>
              <td>{v.metodo_pago}</td>

              <td>
                <Form.Select
                  value={v.estado || "Pendiente"}
                  onChange={(e) =>
                    cambiarEstado(v.id, e.target.value)
                  }
                  size="sm"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado">Pagado</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>

                </Form.Select>

                <div className="mt-1">
                  <Badge bg={colorEstado(v.estado)}>
                    {v.estado}
                  </Badge>
                </div>
              </td>

              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setVentaDetalle(v)}
                >
                  Ver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL DETALLE */}
      <Modal
        show={!!ventaDetalle}
        onHide={() => setVentaDetalle(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Detalle venta #{ventaDetalle?.id}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {ventaDetalle?.detalle?.length ? (
            <Table size="sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ventaDetalle.detalle.map((d, i) => (
                  <tr key={i}>
                    <td>{d.producto}</td>
                    <td>{d.cantidad}</td>
                    <td>
                      ${Number(d.precio).toLocaleString("es-CL")}
                    </td>
                    <td>
                      ${(d.cantidad * d.precio).toLocaleString("es-CL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted mb-0">
              Esta venta no tiene detalle registrado.
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setVentaDetalle(null)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Ventas
