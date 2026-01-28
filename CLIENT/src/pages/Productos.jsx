import { useEffect, useState } from "react"
import { Container, Table, Button, Modal } from "react-bootstrap"
import api from "../services/api"
import ProductoForm from "../components/ProductoForm"
import ServicioForm from "../components/ServicioForm"

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [servicios, setServicios] = useState([])

  const [showProductoModal, setShowProductoModal] = useState(false)
  const [showServicioModal, setShowServicioModal] = useState(false)

  const [productoEdit, setProductoEdit] = useState(null)
  const [servicioEdit, setServicioEdit] = useState(null)

  const cargarProductos = async () => {
    try {
      const { data } = await api.get("/api/productos")
      setProductos(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    }
  }

  const cargarServicios = async () => {
    const { data } = await api.get("/api/servicios")
    setServicios(data.servicios || data)
  }

  useEffect(() => {
    cargarProductos()
    cargarServicios()
  }, [])

  /* PRODUCTOS */

  const abrirCrearProducto = () => {
    setProductoEdit(null)
    setShowProductoModal(true)
  }

  const abrirEditarProducto = (producto) => {
    setProductoEdit(producto)
    setShowProductoModal(true)
  }

  const cerrarProductoModal = () => {
    setProductoEdit(null)
    setShowProductoModal(false)
  }

  /* SERVICIOS */

  const abrirCrearServicio = () => {
    setServicioEdit(null)
    setShowServicioModal(true)
  }

  const abrirEditarServicio = (servicio) => {
    setServicioEdit(servicio)
    setShowServicioModal(true)
  }

  const cerrarServicioModal = () => {
    setServicioEdit(null)
    setShowServicioModal(false)
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4">Administración</h3>

      {/* PRODUCTOS */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Productos</h4>
          <Button size="sm" onClick={abrirCrearProducto}>
            Crear producto
          </Button>
        </div>

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>${Number(p.precio).toLocaleString("es-CL")}</td>
                <td>{p.stock}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => abrirEditarProducto(p)}
                    >
                      Modificar
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        if (!confirm("¿Eliminar producto?")) return
                        await api.delete(`/api/productos/${p.id}`)
                        cargarProductos()
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* SERVICIOS */}
      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Servicios</h4>
          <Button size="sm" onClick={abrirCrearServicio}>
            Crear servicio
          </Button>
        </div>

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.nombre}</td>
                <td>${Number(s.precio).toLocaleString("es-CL")}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => abrirEditarServicio(s)}
                    >
                      Modificar
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        if (!confirm("¿Eliminar servicio?")) return
                        await api.delete(`/api/servicios/${s.id}`)
                        cargarServicios()
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* MODAL PRODUCTO NUEVO */}
      <Modal show={showProductoModal} onHide={cerrarProductoModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {productoEdit ? "Modificar producto" : "Crear producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductoForm
            productoEdit={productoEdit}
            onFinish={() => {
              cerrarProductoModal()
              cargarProductos()
            }}
          />
        </Modal.Body>
      </Modal>

      {/* MODAL SERVICIO NUEVO*/}
      <Modal show={showServicioModal} onHide={cerrarServicioModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {servicioEdit ? "Modificar servicio" : "Crear servicio"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ServicioForm
            servicioEdit={servicioEdit}
            onFinish={() => {
              cerrarServicioModal()
              cargarServicios()
            }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  )
}
