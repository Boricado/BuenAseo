import express from "express"
import pool from "../db/db.js"
import { verificarToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Obtener todos los servicios
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM servicios ORDER BY nombre ASC")
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener servicios" })
  }
})

// Obtener un servicio por ID (para la página individual)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM servicios WHERE id = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "No encontrado" })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error de servidor" })
  }
})

// CREAR SERVICIO (SUPER)
router.post("/", verificarToken, async (req, res) => {
  if (req.usuario.rol !== "Super") {
    return res.status(403).json({ ok: false, error: "Acceso denegado" })
  }

  const { id, nombre, precio, descripcion, imagen_url } = req.body

  try {
    await pool.query(
      `INSERT INTO servicios (id, nombre, precio, descripcion, imagen_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, nombre, precio, descripcion, imagen_url]
    )

    res.json({ ok: true, message: "Servicio creado" })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// EDITAR SERVICIO (SUPER)
router.put("/:id", verificarToken, async (req, res) => {
  if (req.usuario.rol !== "Super") {
    return res.status(403).json({ ok: false, error: "Acceso denegado" })
  }

  const { id } = req.params
  const { nombre, precio, descripcion, imagen_url } = req.body

  try {
    await pool.query(
      `UPDATE servicios
       SET nombre = $1,
           precio = $2,
           descripcion = $3,
           imagen_url = $4
       WHERE id = $5`,
      [nombre, precio, descripcion, imagen_url, id]
    )

    res.json({ ok: true, message: "Servicio actualizado" })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// ELIMINAR SERVICIO (SUPER)
router.delete("/:id", verificarToken, async (req, res) => {
  if (req.usuario.rol !== "Super") {
    return res.status(403).json({
      ok: false,
      error: "Acceso denegado"
    })
  }

  const { id } = req.params

  try {
    const result = await pool.query(
      "DELETE FROM servicios WHERE id = $1 RETURNING id",
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        error: "Servicio no encontrado"
      })
    }

    res.json({
      ok: true,
      message: "Servicio eliminado correctamente"
    })
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    })
  }
})


export default router