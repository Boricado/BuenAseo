import express from "express"
import pool from "../db/db.js"
import { verificarToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Obtener el carrito completo
router.get("/", verificarToken, async (req, res) => {
  try {
    // Usamos una consulta que busca en ambas tablas (productos y servicios)
    const result = await pool.query(
      `SELECT 
        c.id, 
        c.item_id, 
        c.cantidad, 
        c.tipo,
        COALESCE(p.nombre, s.nombre) AS nombre,
        COALESCE(p.precio, s.precio) AS precio,
        COALESCE(p.imagen_url, s.imagen_url) AS imagen_url
      FROM carrito c
      LEFT JOIN productos p ON c.item_id = p.id
      LEFT JOIN servicios s ON c.item_id = s.id
      WHERE c.usuario_id = $1`,
      [req.usuario.id]
    )
    
    const itemsFormateados = result.rows.map(row => ({
      ...row,
      id: row.item_id // React espera item.id para las keys y funciones
    }))

    res.json(itemsFormateados)
  } catch (err) {
    console.error("Error en GET carrito:", err.message)
    res.status(500).json({ error: "Error al obtener carrito" })
  }
})

// Agregar item al carrito
router.post("/", verificarToken, async (req, res) => {
  try {
    // Intentamos capturar todas las variantes posibles
    const { id, item_id, tipo, cantidad } = req.body
    const finalId = id || item_id // Si 'id' es undefined, usa 'item_id'
    const usuario_id = req.usuario.id

    console.log("Datos capturados en el Backend:", { usuario_id, finalId, tipo, cantidad })

    // Validación
    if (!finalId || !tipo) {
      return res.status(400).json({ 
        ok: false, 
        error: "Falta el ID del producto o el Tipo (Producto/Servicio)" 
      })
    }

    const query = `
      INSERT INTO carrito (usuario_id, item_id, cantidad, tipo) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (usuario_id, item_id) 
      DO UPDATE SET cantidad = carrito.cantidad + EXCLUDED.cantidad
    `

    await pool.query(query, [usuario_id, finalId, cantidad || 1, tipo])

    res.json({ ok: true, msg: "Añadido con éxito" })
  } catch (error) {
    console.error("ERROR EN SQL CARRITO:", error.message)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Actualizar cantidad de un item
router.put("/:id", verificarToken, async (req, res) => {
  const { cantidad } = req.body
  const { id } = req.params
  const usuario_id = req.usuario.id

  if (!cantidad || cantidad < 1) {
    return res.status(400).json({ error: "Cantidad inválida" })
  }

  try {
    await pool.query(
      `UPDATE carrito
       SET cantidad = $1
       WHERE usuario_id = $2 AND item_id = $3`,
      [cantidad, usuario_id, id]
    )

    res.json({ ok: true })
  } catch (error) {
    console.error("Error actualizando cantidad:", error.message)
    res.status(500).json({ error: "Error actualizando carrito" })
  }
})

// Eliminar item del carrito
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const usuario_id = req.usuario.id
    const item_id = req.params.id

    await pool.query(
      `DELETE FROM carrito 
       WHERE usuario_id = $1 AND item_id = $2`,
      [usuario_id, item_id]
    )

    res.json({ ok: true })
  } catch (error) {
    console.error("Error DELETE carrito:", error.message)
    res.status(500).json({ ok: false })
  }
})


export default router