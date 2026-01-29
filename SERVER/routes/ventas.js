import express from "express"
import pool from "../db/db.js"
import { verificarToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

// CHECKOUT Y HISTORIAL DE COMPRAS
router.post("/checkout", verificarToken, async (req, res) => {
    const client = await pool.connect()
    try {
        const { nombre, direccion, metodo_pago, items, total } = req.body
        const usuario_id = req.usuario.id

        if (!items || items.length === 0) {
            return res.status(400).json({ ok: false, error: "El carrito está vacío" })
        }

        await client.query('BEGIN')

        const totalEntero = Math.round(parseFloat(total))

        // Cabecera de ventas
        const ventaRes = await client.query(
            `INSERT INTO ventas (usuario_id, nombre_cliente, direccion, metodo_pago, total, estado) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [usuario_id, nombre, direccion, metodo_pago, totalEntero, "Pendiente"]
        )
        const ventaId = ventaRes.rows[0].id

        // Insertar detalles
        for (const item of items) {
          const precioUnitario = Math.round(parseFloat(item.precio))

          // Insertar detalle de venta
          await client.query(
            `INSERT INTO ventas_detalle (venta_id, item_id, cantidad, precio_unitario) 
            VALUES ($1, $2, $3, $4)`,
            [ventaId, item.id, item.cantidad, precioUnitario]
          )

          // DESCONTAR STOCK SOLO SI ES PRODUCTO
          if (item.id.startsWith("PRD")) {
            const result = await client.query(
              `UPDATE productos
              SET stock = stock - $1
              WHERE id = $2 AND stock >= $1
              RETURNING stock`,
              [item.cantidad, item.id]
            )

            if (result.rowCount === 0) {
              throw new Error(`Stock insuficiente para el producto ${item.id}`)
            }
          }
        }

        // Vaciar carrito
        await client.query("DELETE FROM carrito WHERE usuario_id = $1", [usuario_id])

        await client.query('COMMIT')
        res.json({ ok: true, msg: "Venta procesada con éxito", ventaId })

    } catch (error) {
        await client.query('ROLLBACK')
        res.status(500).json({ ok: false, error: error.message })
    } finally {
        client.release()
    }
})

// MIS COMPRAS
router.get("/mis-compras", verificarToken, async (req, res) => {
  try {
    const usuario_id = req.usuario.id

    const query = `
      SELECT 
        v.id, 
        v.fecha, 
        v.total, 
        v.metodo_pago,
        v.direccion,
        v.estado,
        json_agg(
          json_build_object(
            'nombre', COALESCE(p.nombre, s.nombre),
            'cantidad', vd.cantidad,
            'precio', vd.precio_unitario
          )
        ) AS detalles
      FROM ventas v
      JOIN ventas_detalle vd ON v.id = vd.venta_id
      LEFT JOIN productos p ON vd.item_id = p.id
      LEFT JOIN servicios s ON vd.item_id = s.id
      WHERE v.usuario_id = $1
      GROUP BY v.id
      ORDER BY v.fecha DESC
    `

    const result = await pool.query(query, [usuario_id])

    res.json({ ok: true, compras: result.rows })
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Error al obtener historial"
    })
  }
})


// VER LAS VENTAS REALIZADAS POR LOS CLIENTES (SOLO SUPER)
router.get("/", verificarToken, async (req, res) => {
  try {
    let query = `
      SELECT 
        v.id,
        v.fecha,
        v.total,
        v.metodo_pago,
        v.direccion,
        v.estado,
        u.nombre AS cliente,
        COALESCE(
          json_agg(
            json_build_object(
              'producto', COALESCE(p.nombre, s.nombre),
              'cantidad', vd.cantidad,
              'precio', vd.precio_unitario
            )
          ) FILTER (WHERE vd.id IS NOT NULL),
          '[]'
        ) AS detalle
      FROM ventas v
      JOIN usuarios u ON u.id = v.usuario_id
      LEFT JOIN ventas_detalle vd ON vd.venta_id = v.id
      LEFT JOIN productos p ON vd.item_id = p.id
      LEFT JOIN servicios s ON vd.item_id = s.id
    `

    let params = []

    if (req.usuario.rol === "Cliente") {
      query += " WHERE v.usuario_id = $1"
      params.push(req.usuario.id)
    }

    query += " GROUP BY v.id, u.nombre ORDER BY v.fecha DESC"

    const result = await pool.query(query, params)

    res.json({ ok: true, ventas: result.rows })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})


router.get("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params

    const query = `
      SELECT 
        v.id,
        v.fecha,
        v.total,
        v.estado,
        v.metodo_pago,
        v.direccion,
        json_agg(
          json_build_object(
            'nombre', COALESCE(p.nombre, s.nombre),
            'cantidad', vd.cantidad,
            'precio', vd.precio_unitario
          )
        ) AS detalles
      FROM ventas v
      JOIN ventas_detalle vd ON v.id = vd.venta_id
      LEFT JOIN productos p ON vd.item_id = p.id
      LEFT JOIN servicios s ON vd.item_id = s.id
      WHERE v.id = $1
      GROUP BY v.id
    `

    const result = await pool.query(query, [id])

    res.json({
      ok: true,
      venta: result.rows[0]
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Error al obtener venta"
    })
  }
})

router.put("/:id/estado", verificarToken, async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    const estadosPermitidos = ["Pendiente", "Pagado", "En proceso", "Entregado", "Cancelado"]

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        ok: false,
        error: "Estado inválido"
      })
    }

    await pool.query(
      `UPDATE ventas SET estado = $1 WHERE id = $2`,
      [estado, id]
    )

    res.json({
      ok: true,
      msg: "Estado actualizado"
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Error al actualizar estado"
    })
  }
})

export default router