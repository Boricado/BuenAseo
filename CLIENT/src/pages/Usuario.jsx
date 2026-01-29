import { useEffect, useState } from "react"
import { Container, Row, Col, Button, ListGroup, Card, Form} from "react-bootstrap"
import { FaUserCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function Usuario() {
  const [usuario, setUsuario] = useState(null)
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario")

    if (!storedUser || storedUser === "undefined") {
      navigate("/ingresar")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUsuario(parsedUser)
      setFormData(parsedUser)
    } catch {
      localStorage.removeItem("usuario")
      navigate("/ingresar")
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `https://buenaseo.onrender.com/api/usuarios/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await res.json()

      if (res.ok) {
        setUsuario(formData)
        localStorage.setItem("usuario", JSON.stringify(formData))
        setEditando(false)
        alert("Perfil actualizado con éxito")
      } else {
        alert(data.error || "Error al actualizar")
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión")
    }
  }

  const handleDesactivar = async () => {
    const confirmar = window.confirm(
      "¿Seguro que deseas desactivar tu cuenta?"
    )

    if (!confirmar) return

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `https://buenaseo.onrender.com/api/usuarios/${usuario.id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      if (res.ok) {
        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
        alert("Cuenta desactivada correctamente")
        navigate("/ingresar")
      } else {
        alert(data.error || "No se pudo desactivar la cuenta")
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión")
    }
  }

  if (!usuario) {
    return (
      <Container className="py-5 text-center">
        <h4>Cargando...</h4>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3} className="border-end mb-4">
          <ListGroup variant="flush" className="shadow-sm rounded">
            <ListGroup.Item action onClick={() => navigate("/MisCompras")}>
              🛍️ Mis Compras
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => navigate("/MisFavoritos")}>
              ❤️ Mis Favoritos
            </ListGroup.Item>

            {usuario.rol === "Super" && (
              <>
                <ListGroup.Item className="fw-bold mt-3 bg-light">
                  Panel Admin
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => navigate("/Clientes")}>
                  Clientes
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => navigate("/Ventas")}>
                  Ventas
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => navigate("/Productos")}>
                  Productos
                </ListGroup.Item>
              </>
            )}
          </ListGroup>
        </Col>

        <Col md={9}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={4} className="text-center border-end">
                  <FaUserCircle size={120} className="text-secondary mb-3" />
                  <h4>{usuario.nombre}</h4>
                  <p className="text-muted small text-uppercase">
                    {usuario.rol}
                  </p>
                </Col>

                <Col md={8} className="ps-md-5">
                  <div className="d-flex justify-content-between mb-4">
                    <h3>Información del Perfil</h3>
                    {!editando && (
                      <Button
                        variant="outline-primary"
                        onClick={() => setEditando(true)}
                      >
                        Editar Perfil
                      </Button>
                    )}
                  </div>

                  {editando ? (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                          name="direccion"
                          value={formData.direccion || ""}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                          name="telefono"
                          value={formData.telefono || ""}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button variant="success" onClick={handleGuardar}>
                          Guardar
                        </Button>
                        <Button
                          variant="light"
                          onClick={() => {
                            setEditando(false)
                            setFormData(usuario)
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <>
                      <p><strong>Email:</strong> {usuario.email}</p>
                      <p><strong>Dirección:</strong> {usuario.direccion || "No registrada"}</p>
                      <p><strong>Teléfono:</strong> {usuario.telefono || "No registrado"}</p>
                      <hr />
                      <Button
                        variant="outline-danger"
                        onClick={handleDesactivar}
                      >
                        Desactivar cuenta
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Usuario
