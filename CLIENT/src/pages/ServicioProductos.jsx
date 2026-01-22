import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { useContext, useState, useEffect } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"

function ServiciosProductos() {
  const { agregarItem } = useContext(CartContext)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [favoritosIds, setFavoritosIds] = useState([])

  const [busqueda, setBusqueda] = useState("")
  const [orden, setOrden] = useState("nombre-asc")

  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token")
      try {
        setLoading(true)

        const [resProd, resServ] = await Promise.all([
          fetch("http://localhost:3000/api/productos"),
          fetch("http://localhost:3000/api/servicios")
        ])

        const productos = await resProd.json()
        const servicios = await resServ.json()

        setItems([
          ...productos.map(p => ({ ...p, tipo: "Producto" })),
          ...servicios.map(s => ({ ...s, tipo: "Servicio" }))
        ])

        if (token) {
          const resFavs = await fetch("http://localhost:3000/api/favoritos", {
            headers: { Authorization: `Bearer ${token}` }
          })
          const dataFavs = await resFavs.json()
          if (resFavs.ok && dataFavs.favoritos) {
            setFavoritosIds(dataFavs.favoritos.map(f => f.id))
          }
        }
      } catch (error) {
        console.error("Error cargando el catálogo:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  const manejarAgregarCarrito = async (item) => {
    agregarItem({ ...item, cantidad: 1 })

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      await fetch("http://localhost:3000/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: item.id,
          tipo: item.tipo,
          cantidad: 1
        })
      })
    } catch (error) {
      console.error("Error de conexión:", error)
    }
  }

  const toggleFavorito = async (itemId) => {
    const token = localStorage.getItem("token")
    if (!token) return alert("Inicia sesión para guardar favoritos")

    const esFavorito = favoritosIds.includes(itemId)
    const metodo = esFavorito ? "DELETE" : "POST"

    try {
      const res = await fetch(`http://localhost:3000/api/favoritos/${itemId}`, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (res.ok) {
        setFavoritosIds(prev =>
          esFavorito ? prev.filter(id => id !== itemId) : [...prev, itemId]
        )
      }
    } catch (error) {
      console.error("Error al actualizar favorito", error)
    }
  }

  const itemsProcesados = items
    .filter(item =>
      item.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      const precioA = Number(a.precio) || 0
      const precioB = Number(b.precio) || 0

      switch (orden) {
        case "nombre-asc":
          return a.nombre.localeCompare(b.nombre)
        case "nombre-desc":
          return b.nombre.localeCompare(a.nombre)
        case "precio-asc":
          return precioA - precioB
        case "precio-desc":
          return precioB - precioA
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Cargando catálogo...</p>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h4 className="mb-4 fw-bold">Nuestro Catálogo</h4>

      {/* FILTROS */}
      <Row className="mb-4">
        <Col md={6}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>

        <Col md={6}>
          <select
            className="form-select"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="nombre-asc">Nombre A–Z</option>
            <option value="nombre-desc">Nombre Z–A</option>
            <option value="precio-asc">Precio menor a mayor</option>
            <option value="precio-desc">Precio mayor a menor</option>
          </select>
        </Col>
      </Row>

      <Row>
        {itemsProcesados.map(item => {
          const esFav = favoritosIds.includes(item.id)

          return (
            <Col md={4} lg={3} className="mb-4" key={item.id}>
              <Card className="h-100 shadow-sm border-0 position-relative">
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={item.imagen_url || item.picture || "https://via.placeholder.com/200"}
                    style={{ height: "180px", objectFit: "cover" }}
                  />

                  <span className={`badge position-absolute top-0 start-0 m-2 ${item.tipo === "Servicio" ? "bg-info" : "bg-success"}`}>
                    {item.tipo}
                  </span>

                  <Button
                    variant="light"
                    onClick={() => toggleFavorito(item.id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      borderRadius: "50%",
                      width: "35px",
                      height: "35px",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none"
                    }}
                  >
                    {esFav ? <FaHeart className="text-danger" /> : <FaRegHeart className="text-danger" />}
                  </Button>
                </div>

                <Card.Body className="d-flex flex-column p-3 text-center">
                  <Card.Title className="fs-6 fw-bold mb-2">
                    {item.nombre}
                  </Card.Title>

                  <div className="mt-auto">
                    <p className="mb-3 fw-bold text-primary fs-5">
                      ${Number(item.precio).toLocaleString("es-CL")}
                    </p>

                    <div className="d-flex gap-2 justify-content-center">
                      <Link to={`/item/${item.id}`} className="flex-grow-1">
                        <Button size="sm" variant="outline-primary" className="w-100">
                          Detalle
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => manejarAgregarCarrito(item)}
                      >
                        + Carro
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default ServiciosProductos
