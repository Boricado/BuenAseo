import express from "express"
import { verificarToken } from "../middlewares/auth.middleware.js"
import pool from "../db/db.js"

const router = express.Router()

// GET /api/usuarios - Obtener todos los usuarios activos
router.get("/", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, nombre, direccion, telefono, rol FROM usuarios WHERE activo = true"
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

// GET /api/usuarios/:id - Obtener usuario por ID (solo si está activo)
router.get("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      "SELECT id, email, nombre, direccion, telefono, rol FROM usuarios WHERE id = $1 AND activo = true",
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado o inactivo"
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

// PUT /api/usuarios/:id - Actualizar usuario (solo si está activo)
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, email, direccion, telefono, rol } = req.body

    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, email = $2, direccion = $3, telefono = $4, rol = $5 
       WHERE id = $6 AND activo = true
       RETURNING id, nombre, email, direccion, telefono, rol`,
      [nombre, email, direccion, telefono, rol, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado o inactivo"
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

// DELETE /api/usuarios/:id - Desactivar usuario (soft delete)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `
      UPDATE usuarios
      SET activo = false
      WHERE id = $1 AND activo = true
      RETURNING id
      `,
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no existe o ya está desactivado"
      })
    }

    res.json({
      ok: true,
      message: "Usuario desactivado correctamente"
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      ok: false,
      error: "Error al desactivar usuario"
    })
  }
})

export default router
