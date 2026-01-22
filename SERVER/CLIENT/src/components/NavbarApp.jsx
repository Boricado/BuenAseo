import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

function NavbarApp() {
  const navigate = useNavigate()

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

  const cerrarSesion = () => {
    localStorage.clear()
    navigate("/ingresar")
  }

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">Buen Aseo</Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">

            {usuario && (
              <Nav.Link as={Link} to="/usuario">Perfil</Nav.Link>
            )}

            {!usuario && (
              <>
                <Nav.Link as={Link} to="/CrearCuenta">Crear cuenta</Nav.Link>
                <Nav.Link as={Link} to="/ingresar">Ingresar</Nav.Link>
              </>
            )}

            {usuario && (
              <Button
                variant="outline-danger"
                className="ms-3"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </Button>
            )}

            <Button as={Link} to="/carro" variant="primary" className="ms-3">
              <i className="fa-solid fa-cart-arrow-down"></i>
            </Button>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarApp
