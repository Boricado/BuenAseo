import { Container, Button, Card } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"

function CarroSuccess() {
  const location = useLocation()
  
  const totalPagado = location.state?.total || 0
  const numeroCompraReal = location.state?.idVenta || "N/A"

  return (
    <Container className="py-5">
      <Card className="text-center shadow-sm border-0 p-5">
        <div className="mb-4">
           <span style={{ fontSize: "50px", color: "#28a745" }}>✔</span>
        </div>
        
        <h3 className="mb-3 fw-bold text-success">
          ¡Compra Nº {numeroCompraReal} Realizada con Éxito!
        </h3>
        
        <p className="lead">Pronto nos pondremos en contacto para brindarte el mejor servicio.</p>
        
        <div className="bg-light p-3 rounded mb-4">
          <h5 className="mb-0">Total pagado: ${totalPagado.toLocaleString("es-CL")}</h5>
        </div>

        <p className="text-muted small">
          Te recordamos que nuestros horarios de atención son:<br />
          <strong>Lunes a Viernes de 9:00 a 18:00 hrs.</strong>
        </p>

        <div className="mt-4">
          <Link to="/ServiciosProductos">
            <Button variant="primary" size="lg">Volver a la tienda</Button>
          </Link>
        </div>
      </Card>
    </Container>
  )
}

export default CarroSuccess