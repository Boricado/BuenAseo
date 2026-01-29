import { useEffect, useState } from "react"
import { Container, Table, Button, Form, Modal } from "react-bootstrap"

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [show, setShow] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [clienteADesactivar, setClienteADesactivar] = useState(null)

  const [form, setForm] = useState({
    id: "",
    nombre: "",
    email: "",
    direccion: "",
    telefono: "",
    rol: "Cliente"
  })

  const token = localStorage.getItem("token")

  // Cargar clientes
  const cargarClientes = () => {
    fetch("https://buenaseo.onrender.com/api/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok && Array.isArray(data.usuarios)) {
          setClientes(data.usuarios)
        } else {
          setClientes([])
        }
      })
      .catch(error => {
        console.error("Error cargando clientes:", error)
        setClientes([])
      })
  }

  useEffect(() => {
    cargarClientes()
  }, [token])

  const abrirModalEditar = (cliente) => {
    setForm({
      id: cliente.id,
      nombre: cliente.nombre || "",
      email: cliente.email || "",
      direccion: cliente.direccion || "",
      telefono: cliente.telefono || "",
      rol: cliente.rol || "Cliente"
    })
    setShow(true)
  }

  const cerrarModalEditar = () => setShow(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const guardarCambios = async () => {
    try {
      const response = await fetch(
        `https://buenaseo.onrender.com/api/usuarios/${form.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        }
      )

      if (response.ok) {
        cargarClientes()
        cerrarModalEditar()
      } else {
        alert("Error al guardar cambios")
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión")
    }
  }

  // DESACTIVAR
  const abrirModalDesactivar = (cliente) => {
    setClienteADesactivar(cliente)
    setShowDeactivateModal(true)
  }

  const cerrarModalDesactivar = () => {
    setShowDeactivateModal(false)
    setClienteADesactivar(null)
  }

  const desactivarCliente = async () => {
    try {
      const response = await fetch(
        `https://buenaseo.onrender.com/api/usuarios/${clienteADesactivar.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        cargarClientes()
        cerrarModalDesactivar()
      } else {
        alert("Error al desactivar cliente")
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión")
    }
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4">Clientes</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No hay clientes registrados
              </td>
            </tr>
          ) : (
            clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nombre || "Sin nombre"}</td>
                <td>{cliente.email}</td>
                <td>{cliente.direccion || "Sin dirección"}</td>
                <td>{cliente.telefono || "Sin teléfono"}</td>
                <td>{cliente.rol || "Cliente"}</td>
                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    className="me-2"
                    onClick={() => abrirModalEditar(cliente)}
                  >
                    Editar
                  </Button>

                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => abrirModalDesactivar(cliente)}
                  >
                    Desactivar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* MODAL EDITAR */}
      <Modal show={show} onHide={cerrarModalEditar}>
        <Modal.Header closeButton>
          <Modal.Title>Editar cliente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={form.nombre} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={form.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Dirección</Form.Label>
              <Form.Control name="direccion" value={form.direccion} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control name="telefono" value={form.telefono} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rol" value={form.rol} onChange={handleChange}>
                <option value="Cliente">Cliente</option>
                <option value="Super">Super</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalEditar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DESACTIVAR */}
      <Modal show={showDeactivateModal} onHide={cerrarModalDesactivar}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar desactivación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clienteADesactivar && (
            <p>
              ¿Estás seguro de que deseas desactivar al cliente{" "}
              <strong>{clienteADesactivar.nombre}</strong> ({clienteADesactivar.email})?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalDesactivar}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={desactivarCliente}>
            Desactivar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Clientes
