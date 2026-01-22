import { Container, Row, Col, Card, Button, Form } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { useContext, useState, useEffect } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"

function ServicioProductoIndividual() {
  const { id } = useParams()
  const { agregarItem } = useContext(CartContext)
  
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cantidad, setCantidad] = useState(1)
  const [esFavorito, setEsFavorito] = useState(false)

  const formatoCLP = (valor) => {
    return Number(valor).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    })
  }

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        // Determinar si es producto o servicio según el prefijo del ID
        const folder = id.startsWith("PRD") ? "productos" : "servicios"
        
        const res = await fetch(`http://localhost:3000/api/${folder}/${id}`)
        
        if (res.ok) {
          const data = await res.json()
          setItem(data)

          // Verificar si el usuario tiene este item en favoritos
          const token = localStorage.getItem("token")
          if (token) {
            const resFav = await fetch(`http://localhost:3000/api/favoritos/check/${id}`, {
              headers: { "Authorization": `Bearer ${token}` }
            })
            if (resFav.ok) {
              const { existe } = await resFav.json()
              setEsFavorito(existe)
            }
          }
        }
      } catch (error) {
        console.error("Error cargando item:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  if (loading) return <Container className="py-5 text-center"><h4>Cargando detalle...</h4></Container>
  if (!item) return <Container className="py-5 text-center"><h4>Item no encontrado</h4></Container>

  const esProducto = id.startsWith("PRD")

  const toggleFavorito = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Debes iniciar sesión para guardar favoritos")
      return
    }

    try {
      const metodo = esFavorito ? "DELETE" : "POST"
      const res = await fetch(`http://localhost:3000/api/favoritos/${id}`, {
        method: metodo,
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (res.ok) {
        setEsFavorito(!esFavorito)
      } else if (res.status === 401) {
        alert("Tu sesión ha expirado, por favor ingresa nuevamente")
      }
    } catch (error) {
      console.error("Error al actualizar favorito", error)
    }
  }

  return (
    <Container className="py-5">
      <Row>
        {/* COLUMNA IMAGEN */}
        <Col md={7}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Img 
              variant="top" 
              src={item.imagen_url || item.picture || "https://via.placeholder.com/500"} 
              style={{ height: "550px", objectFit: "cover", borderRadius: "12px" }}
              alt={item.nombre}
            />
          </Card>
        </Col>

        {/* COLUMNA DETALLES */}
        <Col md={5}>
          <div className="ps-md-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className={`badge ${esProducto ? 'bg-success' : 'bg-info'} mb-2 px-3 py-2`}>
                  {esProducto ? "Producto" : "Servicio"}
                </span>
                <h2 className="fw-bold display-6">{item.nombre}</h2>
              </div>
              <Button 
                variant="link" 
                className="text-danger p-0 border-0"
                onClick={toggleFavorito}
                style={{ fontSize: "2rem", textDecoration: "none" }}
              >
                {esFavorito ? <FaHeart /> : <FaRegHeart />}
              </Button>
            </div>

            {/* PRECIO */}
            <h3 className="text-primary fw-bold mb-4 fs-2">
              {formatoCLP(item.precio)}
            </h3>

            <p className="text-muted mb-4 lead" style={{ textAlign: "justify", fontSize: "1.1rem" }}>
              {item.descripcion}
            </p>

            {/* SELECTOR DE CANTIDAD (solo productos, servicios otra logica) */}
            {esProducto && item.stock > 0 && (
              <Form.Group className="mb-4 d-flex align-items-center bg-light p-3 rounded">
                <Form.Label className="me-3 mb-0 fw-bold">Cantidad:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={item.stock}
                  value={cantidad} 
                  onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value)))}
                  style={{ width: "90px", textAlign: "center" }}
                />
                <span className="ms-3 text-muted small">
                  ({item.stock} unidades disponibles)
                </span>
              </Form.Group>
            )}

            {/* AGREGAR AL CARRO */}
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                size="lg" 
                className="py-3 fw-bold shadow-sm"
                onClick={() => {
                  agregarItem({ ...item, cantidad })
                  alert(`¡${item.nombre} agregado con éxito!`)
                }}
                disabled={esProducto && item.stock <= 0}
              >
                {esProducto 
                  ? (item.stock > 0 ? "Agregar al carro" : "Producto Agotado") 
                  : "Contratar Servicio Ahora"
                }
              </Button>
            </div>
        
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default ServicioProductoIndividual