import { Container, Card } from "react-bootstrap"

function HorarioAtencion() {
  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body className="text-center">
          <h2 className="mb-4">Horario de Atención</h2>

          <p className="fs-5 mb-2">
            <strong>Lunes a Domingo</strong>
          </p>

          <p className="fs-4">
            09:00 hrs – 18:00 hrs
          </p>

          <p className="text-muted mt-3">
            Atención continua para La Serena y Coquimbo
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default HorarioAtencion
