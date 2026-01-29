import { useEffect, useState, useContext } from "react"
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap"
import { FaTrash, FaEye, FaCartPlus } from "react-icons/fa"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"

function MisFavoritos() {
  const { agregarItem } = useContext(CartContext)
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("https://buenaseo.onrender.com/api/favoritos", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Error al cargar favoritos")
        }

        setFavoritos(data.favoritos || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoritos()
  }, [])

  const eliminarFavorito = async (itemId) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`https://buenaseo.onrender.com/api/favoritos/${itemId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (res.ok) {
        // Filtramos el estado local para que desaparezca de la vista de inmediato
        setFavoritos(prev => prev.filter(fav => fav.id !== itemId))
      }
    } catch (err) {
      console.error("Error al eliminar:", err)
    }
  }

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3">Cargando tus favoritos...</p>
    </Container>
  )

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  )

  if (favoritos.length === 0) return (
    <Container className="py-5 text-center">
      <h4>Aún no tienes productos favoritos</h4>
      <Button as={Link} to="/ServiciosProductos" variant="primary" className="mt-3">
        Explorar catálogo
      </Button>
    </Container>
  )

  return (
    <Container className="py-4">
      <h3 className="mb-4 fw-bold">Mis Favoritos ❤️</h3>
      <Row>
        {favoritos.map((fav) => (
          <Col md={6} lg={4} key={fav.id} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img 
                variant="top" 
                src={fav.imagen_url || fav.imagen || "https://via.placeholder.com/150"} 
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{fav.nombre}</Card.Title>
                <Card.Text className="text-muted small">
                  {fav.descripcion?.length > 70 
                    ? fav.descripcion.substring(0, 70) + "..." 
                    : fav.descripcion}
                </Card.Text>
                
                <h5 className="text-primary fw-bold mb-3">
                  ${Number(fav.precio?.toLocaleString("es-CL"))}
                </h5>

                {/* BOTONES DE ACCIÓN */}
                <div className="d-flex flex-column gap-2 mt-auto">
                  <div className="d-flex gap-2">
                    {/* Botón detalles */}
                    <Button 
                      as={Link} 
                      to={`/item/${fav.id}`} 
                      variant="outline-secondary" 
                      className="w-100 btn-sm"
                    >
                      <FaEye className="me-1" /> Detalles
                    </Button>

                    {/* Botón Agregar al Carrito */}
                    <Button 
                      variant="success" 
                      className="w-100 btn-sm"
                      onClick={() => agregarItem({ ...fav, cantidad: 1 })}
                    >
                      <FaCartPlus className="me-1" /> Agregar
                    </Button>
                  </div>

                  {/* Botón quitar de favoritos */}
                  <Button 
                    variant="link" 
                    className="text-danger text-decoration-none btn-sm mt-1"
                    onClick={() => eliminarFavorito(fav.id)}
                  >
                    <FaTrash className="me-1" /> Quitar de favoritos
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default MisFavoritos