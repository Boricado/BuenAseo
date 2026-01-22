import express from "express"
import pool from "../db/db.js"
import { verificarToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY nombre ASC")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al obtener productos" })
  }
})

// Obtener un producto por ID (para la página individual)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM productos WHERE id = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "No encontrado" })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error de servidor" })
  }
})

// CREAR PRODUCTO (SUPER)
router.post("/", verificarToken, async (req, res) => {
  if (req.usuario.rol !== "Super") {
    return res.status(403).json({ ok: false, error: "Acceso denegado" })
  }

  const { id, nombre, precio, descripcion, stock, imagen_url } = req.body

  try {
    await pool.query(
      `INSERT INTO productos (id, nombre, precio, descripcion, stock, imagen_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, nombre, precio, descripcion, stock, imagen_url]
    )

    res.json({ ok: true, message: "Producto creado" })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})


// EDITAR PRODUCTO (SUPER)
router.put("/:id", verificarToken, async (req, res) => {
  if (req.usuario.rol !== "Super") {
    return res.status(403).json({ ok: false, error: "Acceso denegado" })
  }

  const { id } = req.params
  const { nombre, precio, descripcion, stock, imagen_url } = req.body

  try {
    await pool.query(
      `UPDATE productos
       SET nombre = $1,
           precio = $2,
           descripcion = $3,
           stock = $4,
           imagen_url = $5
       WHERE id = $6`,
      [nombre, precio, descripcion, stock, imagen_url, id]
    )

    res.json({ ok: true, message: "Producto actualizado" })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// ELIMINAR PRODUCTO (SUPER)
router.delete("/:id", verificarToken, async (req, res) => {
  if (req.usuario.rol !== "Super") {
    return res.status(403).json({ ok: false, error: "Acceso denegado" })
  }

  const { id } = req.params

  try {
    await pool.query(
      "DELETE FROM productos WHERE id = $1",
      [id]
    )

    res.json({ ok: true, message: "Producto eliminado" })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})


export default router

