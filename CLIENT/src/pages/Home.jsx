import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button, Container, Spinner, Card, Row, Col } from "react-bootstrap"
import { CartContext } from "../context/CartContext"
import { FaHeart, FaRegHeart, FaBroom, FaUsers, FaShieldAlt } from "react-icons/fa"

function Home() {
  const { agregarItem } = useContext(CartContext)
  const [itemsRandom, setItemsRandom] = useState([])
  const [loading, setLoading] = useState(true)
  const [favoritosIds, setFavoritosIds] = useState([])

  // Cargar datos y favoritos
  useEffect(() => {
    const cargarDatos = async () => {
      const tokenActual = localStorage.getItem("token")
      
      try {
        setLoading(true)
        const [resProd, resServ] = await Promise.all([
          fetch("http://localhost:3000/api/productos"),
          fetch("http://localhost:3000/api/servicios")
        ])

        const productos = await resProd.json()
        const servicios = await resServ.json()
        const todos = [...productos, ...servicios]

        // Si hay sesión activa
        if (tokenActual) {
          try {
            const resFavs = await fetch("http://localhost:3000/api/favoritos", {
              headers: { "Authorization": `Bearer ${tokenActual}` }
            })
            const dataFavs = await resFavs.json()
            if (resFavs.ok && dataFavs.favoritos) {
              setFavoritosIds(dataFavs.favoritos.map(f => f.id))
            }
          } catch (err) {
            console.error("Error cargando favoritos:", err)
          }
        }

        const mezclados = todos.sort(() => Math.random() - 0.5).slice(0, 3)
        setItemsRandom(mezclados)
      } catch (error) {
        console.error("Error cargando datos del Home:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, []) // Solo se ejecuta 1 vez al cargar inicialmente

  // Manejo de favoritos
  const toggleFavorito = async (itemId) => {
    const tokenCheck = localStorage.getItem("token")

    if (!tokenCheck) {
      alert("Debes iniciar sesión para guardar favoritos")
      return
    }

    const esYaFavorito = favoritosIds.includes(itemId)
    const metodo = esYaFavorito ? "DELETE" : "POST"

    try {
      const res = await fetch(`http://localhost:3000/api/favoritos/${itemId}`, {
        method: metodo,
        headers: { 
          "Authorization": `Bearer ${tokenCheck}`,
          "Content-Type": "application/json"
        }
      })

      if (res.ok) {
        setFavoritosIds(prev => 
          esYaFavorito ? prev.filter(id => id !== itemId) : [...prev, itemId]
        )
      } else if (res.status === 401) {
        alert("Tu sesión ha expirado. Por favor, ingresa de nuevo.")
      }
    } catch (error) {
      console.error("Error al actualizar favorito", error)
    }
  }

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="bg-light py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Bienvenido a Buen Aseo</h1>
          <p className="lead">Tu solución de limpieza a domicilio y productos especializados.</p>
          <Link to="/ServiciosProductos">
            <Button variant="primary" size="lg" className="shadow">
              Ver catálogo completo
            </Button>
          </Link>
        </Container>
      </section>

      {/* 2. FEATURED PRODUCTS (DESTACADOS) */}
      <section id="featured" className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5">Destacados</h2>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Buscando las mejores opciones...</p>
            </div>
          ) : (
            <Row>
              {itemsRandom.map((item) => {
                const esFav = favoritosIds.includes(item.id)
                return (
                  <Col md={4} key={item.id} className="mb-4">
                    <Card className="h-100 shadow-sm border-0 position-relative">
                      {/* Botón de Favorito */}
                      <Button
                        variant="link"
                        className="position-absolute top-0 end-0 p-3 text-danger"
                        style={{ zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '0 0 0 15px' }}
                        onClick={() => toggleFavorito(item.id)}
                      >
                        {esFav ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
                      </Button>

                      <Card.Img
                        variant="top"
                        src={item.imagen_url || item.picture}
                        style={{ height: "220px", objectFit: "cover" }}
                        alt={item.nombre}
                      />
                      
                      <Card.Body className="text-center">
                        <Card.Title className="fw-bold">{item.nombre}</Card.Title>
                        <Card.Text className="text-muted small">
                          {item.descripcion?.length > 80 
                            ? item.descripcion.substring(0, 80) + "..." 
                            : item.descripcion}
                        </Card.Text>
                        <p className="fw-bold text-primary fs-4">
                          ${Number(item.precio).toLocaleString("es-CL")}
                        </p>

                        <div className="d-flex justify-content-center gap-2">
                          <Button as={Link} to={`/item/${item.id}`} variant="outline-primary" size="sm">
                            Ver detalle
                          </Button>
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => agregarItem({ ...item, cantidad: 1 })}
                          >
                            <i className="fa-solid fa-cart-plus me-1"></i> Agregar
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          )}
        </Container>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">¿Por qué elegirnos?</h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div className="mb-3 text-primary"><FaBroom size={50} /></div>
              <h5 className="fw-bold">Gestión Profesional</h5>
              <p className="text-muted">Organizamos tus limpiezas con personal verificado.</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="mb-3 text-primary"><FaUsers size={50} /></div>
              <h5 className="fw-bold">Confianza Total</h5>
              <p className="text-muted">Comunicación transparente en todo momento.</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="mb-3 text-primary"><FaShieldAlt size={50} /></div>
              <h5 className="fw-bold">Garantía de Servicio</h5>
              <p className="text-muted">Calidad asegurada o lo solucionamos de inmediato.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 4. PRE-FOOTER */}
      <section className="py-5 bg-primary text-white text-center">
        <Container>
          <h2 className="mb-3 fw-bold">¿Necesitas un plan a medida?</h2>
          <p className="lead mb-4">Contáctanos y diseñaremos una solución para ti.</p>
          <Link to="/contacto">
            <Button variant="light" size="lg" className="px-5 shadow-sm fw-bold text-primary">
              Escribenos Ahora
            </Button>
          </Link>
        </Container>
      </section>
    </>
  )
}

export default Home