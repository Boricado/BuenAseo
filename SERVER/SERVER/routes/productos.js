import express from "express"
import pool from "../db/db.js"

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

export default router