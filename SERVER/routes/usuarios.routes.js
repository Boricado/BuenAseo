import express from "express"
import { verificarToken } from "../middlewares/auth.middleware.js"
import pool from "../db/db.js"

const router = express.Router()

// GET /api/usuarios - Obtener todos los usuarios
router.get("/", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, nombre, direccion, telefono, rol FROM usuarios"
    )
    res.json({
      ok: true,
      usuarios: result.rows
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    })
  }
})

// GET /api/usuarios/perfil - Obtener perfil del usuario autenticado
router.get("/perfil", verificarToken, (req, res) => {
  res.json({
    ok: true,
    usuario: req.usuario
  })
})

// PUT /api/usuarios/:id - Actualizar usuario
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, email, direccion, telefono, rol } = req.body

    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, email = $2, direccion = $3, telefono = $4, rol = $5 
       WHERE id = $6 
       RETURNING id, nombre, email, direccion, telefono, rol`,
      [nombre, email, direccion, telefono, rol, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado"
      })
    }

    res.json({
      ok: true,
      usuario: result.rows[0]
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    })
  }
})

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING id",
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado"
      })
    }

    res.json({
      ok: true,
      message: "Usuario eliminado correctamente"
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    })
  }
})

export default router