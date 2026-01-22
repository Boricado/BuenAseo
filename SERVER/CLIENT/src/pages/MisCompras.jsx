import { useEffect, useState } from "react"
import { Container, Row, Col, Card, ListGroup, Spinner, Alert } from "react-bootstrap"

function MisCompras() {
  const [compras, setCompras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:3000/api/ventas/mis-compras", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Error al cargar compras")
        }

        setCompras(data.compras)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCompras()
  }, [])

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando compras...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  if (compras.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h4>No tienes compras registradas aún</h4>
      </Container>
    )
  }

    return (
        <Container className="py-4">
        <h3 className="mb-4">Mis Pedidos Realizados</h3>
        <Row>
            {compras.map((compra) => (
            <Col lg={12} key={compra.id} className="mb-4">
                <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between">
                    <span><strong>Orden Nº:</strong> {compra.id}</span>
                    <span>{new Date(compra.fecha).toLocaleDateString("es-CL")}</span>
                </Card.Header>
                <Card.Body>
                    <Row>
                    <Col md={8}>
                        <h6><strong>Productos / Servicios:</strong></h6>
                        <ListGroup variant="flush">
                        {compra.detalles.map((item, idx) => (
                            <ListGroup.Item key={idx} className="ps-0">
                            {item.nombre} - {item.cantidad} x ${Number(item.precio).toLocaleString("es-CL")}
                            </ListGroup.Item>
                        ))}
                        </ListGroup>
                    </Col>
                    <Col md={4} className="text-end border-start">
                        <p className="mb-1 text-muted">Pago: {compra.metodo_pago}</p>
                        <p className="mb-3 text-muted">Envío: {compra.direccion}</p>
                        <h4 className="text-primary">${Number(compra.total).toLocaleString("es-CL")}</h4>
                    </Col>
                    </Row>
                </Card.Body>
                </Card>
            </Col>
            ))}
        </Row>
        </Container>
    )
}

export default MisCompras
