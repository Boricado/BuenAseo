import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import pool from "./db/db.js"
import { verificarToken } from "./middlewares/auth.middleware.js" 
import favoritosRoutes from "./routes/favoritos.js"
import carritoRoutes from "./routes/carrito.js"
import productosRoutes from "./routes/productos.js"
import serviciosRoutes from "./routes/servicios.js"
import dotenv from "dotenv"
import ventasRoutes from "./routes/ventas.js"
import usuariosRoutes from "./routes/usuarios.routes.js"

const app = express()
const PORT = 3000

dotenv.config()

// Middleware
app.use(cors({
  origin: "https://buen-aseo.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"] 
}))
app.use(express.json())


// Rutas
app.use("/api", authRoutes)
app.use("/api/favoritos", verificarToken, favoritosRoutes)
app.use("/api/carrito", verificarToken, carritoRoutes)
app.use("/api/productos", productosRoutes)
app.use("/api/servicios", serviciosRoutes)
app.use("/api/ventas", ventasRoutes)
app.use("/api/usuarios", usuariosRoutes)

// Ruta test
app.get("/", (req, res) => {
  res.send("Back vivo,")
})

// Test DB
app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1")
    res.json({ ok: true, db: "conectada" })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Back corriendo en http://localhost:${PORT}`)
})

export default app //Para Tests