import pool from "../db/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query(
    "SELECT id, nombre, direccion, telefono, email, rol, password_hash, picture FROM usuarios WHERE email = $1",
    [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, message: "Credenciales incorrectas" })
    }

    const usuario = result.rows[0]
    const valid = await bcrypt.compare(password, usuario.password_hash)

    if (!valid) {
      return res.status(401).json({ ok: false, message: "Credenciales incorrectas" })
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || "secreto_super_secreto",
      { expiresIn: "1d" }
    )

    res.json({
    ok: true,
    token,
    usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        direccion: usuario.direccion,
        telefono: usuario.telefono,
        email: usuario.email,
        rol: usuario.rol,
        picture: usuario.picture
    }
    })

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

// REGISTRO DE USUARIO
export const register = async (req, res) => {
  const { nombre, direccion, telefono, email, password } = req.body

  try {
    // Verificar si ya existe
    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    )

    if (existe.rows.length > 0) {
      return res.status(400).json({ ok: false, message: "Correo ya registrado" })
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10)

    // Insertar y devolver usuario recién creado
    const result = await pool.query(
    `INSERT INTO usuarios 
    (nombre, direccion, telefono, email, password_hash, rol, picture)
    VALUES ($1, $2, $3, $4, $5, 'Cliente', NULL)
    RETURNING id, nombre, direccion, telefono, email, rol, picture`,
    [nombre, direccion, telefono, email, hash]
    )


    const nuevoUsuario = result.rows[0]

    // Generar token con tiempo de expiración
    const token = jwt.sign(
      { id: nuevoUsuario.id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET || "secreto_super_secreto",
      { expiresIn: "1d" }
    )

    // Responder con usuario y token
    res.json({
      ok: true,
      token,
      usuario: nuevoUsuario
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: err.message })
  }
}


// MODIFICAR USUARIO
export const updateUser = async (req, res) => {
  const { nombre, direccion, telefono } = req.body
  const { id } = req.params

  try {
    await pool.query(
      "UPDATE usuarios SET nombre=$1, direccion=$2, telefono=$3 WHERE id=$4",
      [nombre, direccion, telefono, id]
    )

    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
