import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { FaUserCircle } from "react-icons/fa"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function CrearCuenta() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    password: "",
    confirm: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      const res = await fetch("https://buenaseo.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

    const data = await res.json()
    console.log("Respuesta backend:", data)


      if (!res.ok || !data.ok) {
        setError(data.message || "Error al crear cuenta")
        return
      }

      // Guardar usuario y token SOLO si todo salió bien
      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", JSON.stringify(data.usuario))

      // Redirigir 
      navigate("/usuario")
    } catch (err) {
      setError("Error de conexión con el servidor")
    }
  }


  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h4>Crear cuenta</h4>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Control name="nombre" placeholder="Nombre" onChange={handleChange} className="mb-2" />
                <Form.Control name="direccion" placeholder="Dirección" onChange={handleChange} className="mb-2" />
                <Form.Control name="telefono" placeholder="Teléfono" onChange={handleChange} className="mb-2" />
                <Form.Control name="email" type="email" placeholder="Correo" onChange={handleChange} className="mb-2" />
                <Form.Control name="password" type="password" placeholder="Contraseña" onChange={handleChange} className="mb-2" />
                <Form.Control name="confirm" type="password" placeholder="Confirmar contraseña" onChange={handleChange} className="mb-3" />

                <Button type="submit" className="w-100">Crear cuenta</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CrearCuenta
