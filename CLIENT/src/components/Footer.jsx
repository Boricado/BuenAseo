import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
      <Container>
        <Row>
          {/* Columna izquierda */}
          <Col md={6} className="mb-4">
            <h5>Te ayudamos</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/Contacto" className="text-white text-decoration-none">
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link to="/MisCompras" className="text-white text-decoration-none">
                  Estado del pedido
                </Link>
              </li>
              <li>
                <Link to="/horarios" className="text-white text-decoration-none">
                  Horario de atención
                </Link>
              </li>
            </ul>
          </Col>

          {/* Columna derecha */}
          <Col md={6} className="mb-4">
            <h5>Nuestra empresa</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/sobre-nosotros" className="text-white text-decoration-none">
                  Sobre Buen Aseo
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-white text-decoration-none">
                  Términos y condiciones
                </Link>
              </li>
            </ul>

            <div className="mt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <i className="fab fa-instagram fa-lg"></i>
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <div className="text-center mt-4">
          <small>BUEN ASEO SPA © {new Date().getFullYear()} · TODOS LOS DERECHOS RESERVADOS</small>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
