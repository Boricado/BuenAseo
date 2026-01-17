import { Container, Row, Col, Card } from "react-bootstrap"

function SobreNosotros() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Sobre Nosotros</h2>

              <p className="fs-5">
                <strong>Buen Aseo SpA</strong> es una empresa dedicada a servicios de
                limpieza profesional en la ciudad de <strong>Coquimbo y La Serena</strong>.
                Nos enfocamos en entregar un servicio claro, eficiente y confiable,
                especialmente pensado para departamentos, hogares y arriendos tipo Airbnb.
              </p>

              <p className="fs-5">
                Nuestro objetivo es simple: que el cliente reciba su espacio limpio,
                ordenado y listo para ser utilizado, sin sorpresas ni trabajos a medias.
                Por eso trabajamos con tiempos definidos, procesos estandarizados y
                atención directa.
              </p>

              <p className="fs-5">
                Ofrecemos servicios de limpieza regular y limpieza profunda, además de
                productos complementarios como sábanas, plumones y almohadas, pensados
                para facilitar la gestión de arriendos y mantención del hogar.
              </p>

              <p className="fs-5">
                En Buen Aseo creemos que la limpieza no debería ser un problema, sino
                una solución. Hacemos el trabajo bien, a la primera.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SobreNosotros
