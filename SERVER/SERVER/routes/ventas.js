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
            `INSERT INTO ventas (usuario_id, nombre_cliente, direccion, metodo_pago, total) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [usuario_id, nombre, direccion, metodo_pago, totalEntero]
        )
        const ventaId = ventaRes.rows[0].id

        // Insertar detalles
        for (const item of items) {
            const precioUnitario = Math.round(parseFloat(item.precio))
            await client.query(
                `INSERT INTO ventas_detalle (venta_id, item_id, cantidad, precio_unitario) 
                 VALUES ($1, $2, $3, $4)`,
                [ventaId, item.id, item.cantidad, precioUnitario]
            );
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
                json_agg(json_build_object(
                    'nombre', COALESCE(p.nombre, s.nombre),
                    'cantidad', vd.cantidad,
                    'precio', vd.precio_unitario
                )) AS detalles
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
        res.status(500).json({ ok: false, error: "Error al obtener historial" })
    }
})

export default router