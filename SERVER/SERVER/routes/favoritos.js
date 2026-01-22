import express from "express"
import pool from "../db/db.js"
import { verificarToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

// OBTENER FAVORITOS (productos y servicios)
router.get("/", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.item_id AS id, p.nombre, p.precio, p.imagen_url AS imagen, 'producto' AS tipo
       FROM favoritos f
       JOIN productos p ON f.item_id = p.id
       WHERE f.usuario_id = $1
       UNION
       SELECT f.item_id AS id, s.nombre, s.precio, s.imagen_url AS imagen, 'servicio' AS tipo
       FROM favoritos f
       JOIN servicios s ON f.item_id = s.id
       WHERE f.usuario_id = $1`,
      [req.usuario.id]
    )
    res.json({ ok: true, favoritos: result.rows })
  } catch (err) {
    res.status(500).json({ ok: false, message: "Error al obtener favoritos" })
  }
})

// CHECK FAVORITO (Para que el corazón aparezca rojo al cargar)
router.get("/check/:itemId", verificarToken, async (req, res) => {
  const { itemId } = req.params
  const result = await pool.query(
    "SELECT 1 FROM favoritos WHERE usuario_id = $1 AND item_id = $2",
    [req.usuario.id, itemId]
  )
  res.json({ existe: result.rowCount > 0 })
})

// AGREGAR
router.post("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params
    const usuario_id = req.usuario.id

    await pool.query(
      "INSERT INTO favoritos (usuario_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", // ON CONFLICT DO NOTHING evita errores si el usuario hace clic dos veces
      [usuario_id, id]
    )

    res.json({ ok: true, msg: "Operación exitosa" })
  } catch (error) {
    console.error("Error detallado en el servidor:", error.message)
    res.status(500).json({ ok: false, msg: "Error al guardar favorito", detail: error.message })
  }
})

// ELIMINAR
router.delete("/:itemId", verificarToken, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM favoritos WHERE usuario_id = $1 AND item_id = $2",
      [req.usuario.id, req.params.itemId]
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ ok: false })
  }
})

export default router