import request from "supertest"
import app from "./index.js"
import pool from "./db/db.js"

describe("Pruebas de Rutas API REST", () => {
  
  // asegurar que la DB se cierre siempre, sin importar qué test falle.
  afterAll(async () => {
    await pool.end()
  })

  // RUTA 1: GET / (Pública - Éxito)
  test("GET / debería retornar 200 OK", async () => {
    const response = await request(app).get("/")
    expect(response.statusCode).toBe(200)
    expect(response.text).toContain("Back vivo")
  })

  // RUTA 2: GET /db (Base de datos - Éxito/Error controlado)
  test("GET /db debería retornar 200 o 500", async () => {
    const response = await request(app).get("/db")
    expect([200, 500]).toContain(response.statusCode)
  })

  // RUTA 3: GET /api/favoritos (Protegida - Falla sin Token)
  test("GET /api/favoritos debería retornar 401 (No autorizado)", async () => {
    const response = await request(app).get("/api/favoritos")
    expect(response.statusCode).toBe(401)
  })

  // RUTA 4: GET /api/no-existe (Error 404)
  test("GET /api/no-existe debería retornar 404 Not Found", async () => {
    const response = await request(app).get("/api/no-existe")
    expect(response.statusCode).toBe(404)
  })

  describe("Pruebas avanzadas de Productos (POST, PUT, DELETE)", () => {

    // 5: POST - Intentar crear sin token (401 Unauthorized)
    test("POST /api/productos debería fallar sin token (401)", async () => {
      const nuevoProducto = {
        id: "TEST01",
        nombre: "Producto Test",
        precio: 1000,
        descripcion: "Test",
        stock: 10,
        imagen_url: "url"
      }
      
      const response = await request(app)
        .post("/api/productos")
        .send(nuevoProducto)

      expect(response.statusCode).toBe(401)
    })

    // 6: PUT - Token Inválido vs Permisos
    // CORRECCIÓN: Si el token es "falso", el middleware responde 401. 
    // Solo responde 403 si el token es VÁLIDO pero el ROL es incorrecto.
    test("PUT /api/productos/:id debería retornar 401 con token inválido", async () => {
      const editData = { nombre: "Editado" }
      
      const response = await request(app)
        .put("/api/productos/TEST01")
        .set("Authorization", "Bearer token_falso_que_no_existe")
        .send(editData)

      expect(response.statusCode).toBe(401)
    })

    // 7: DELETE - Eliminar un producto sin autorización
    test("DELETE /api/productos/:id debería fallar si no hay autorización (401)", async () => {
      const response = await request(app).delete("/api/productos/1")
      expect(response.statusCode).toBe(401)
    })

    // 8: GET (Status 404) - Producto que no existe
    test("GET /api/productos/:id debería retornar 404 si el ID no existe", async () => {
      const response = await request(app).get("/api/productos/9999999")
      expect(response.statusCode).toBe(404)
      expect(response.body.error).toBe("No encontrado")
    })
  })
})