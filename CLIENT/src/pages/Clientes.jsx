import { useEffect, useState } from "react"
import { Container, Table, Button, Form, Modal } from "react-bootstrap"

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [show, setShow] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clienteAEliminar, setClienteAEliminar] = useState(null)
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
    fetch("http://localhost:3000/api/usuarios", {
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

  const abrirModal = (cliente) => {
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

  const cerrarModal = () => {
    setShow(false)
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const guardarCambios = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        cargarClientes() // Recargar la lista actualizada
        cerrarModal()
      } else {
        alert("Error al guardar cambios")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al guardar cambios")
    }
  }

  const abrirModalEliminar = (cliente) => {
    setClienteAEliminar(cliente)
    setShowDeleteModal(true)
  }

  const cerrarModalEliminar = () => {
    setShowDeleteModal(false)
    setClienteAEliminar(null)
  }

  const eliminarCliente = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${clienteAEliminar.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        cargarClientes() // Recargar la lista
        cerrarModalEliminar()
      } else {
        alert("Error al eliminar cliente")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar cliente")
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
              <td colSpan="6" className="text-center">No hay clientes registrados</td>
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
                    onClick={() => abrirModal(cliente)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => abrirModalEliminar(cliente)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* EDITAR */}
      <Modal show={show} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar cliente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="rol"
                value={form.rol}
                onChange={handleChange}
              >
                <option value="Cliente">Cliente</option>
                <option value="Super">Super</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL (Ventana emergente) ELIMINAR */}
      <Modal show={showDeleteModal} onHide={cerrarModalEliminar}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clienteAEliminar && (
            <p>
              ¿Estás seguro de que deseas eliminar al cliente{" "}
              <strong>{clienteAEliminar.nombre}</strong> ({clienteAEliminar.email})?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalEliminar}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarCliente}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Clientes