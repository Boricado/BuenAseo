import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa"

function Ingreso() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      setLoading(true)
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || "Credenciales incorrectas")

      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", JSON.stringify(data.usuario))
      window.location.href = "/"
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-light py-5" style={{ minHeight: "100vh" }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} md={8} lg={5}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <FaUserCircle size={50} className="text-primary mb-2" />
                  <h2 className="fw-bold h3">Bienvenido</h2>
                  <p className="text-muted">Ingresa a tu cuenta para continuar</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Correo electrónico</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white"><FaEnvelope className="text-muted"/></InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="ejemplo@correo.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold small">Contraseña</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white"><FaLock className="text-muted"/></InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100 py-2 fw-bold" disabled={loading}>
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                  </Button>
                </Form>

                <div className="text-center mt-4 pt-2 border-top">
                  <p className="small text-muted mb-1">¿No tienes una cuenta?</p>
                  <Link to="/CrearCuenta" className="fw-bold text-decoration-none">
                    Regístrate aquí
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Ingreso