// Creacion de usuarios
// POST /usuarios
request:
  payload: {
    nombre: String,
    email: String,
    password: String,
    picture: String,
  }

response:
  {
    id: Number,
    nombre: String,
    email: String,
    picture: String
  }


// Carga de usuarios
// GET /usuarios/{id}
response:
  {
    id: Number,
    nombre: String,
    email: String,
    picture: String
  }


// Carga de productos
// GET /productos
response:
  [
    {
      id: Number,
      nombre: String,
      descripcion: String,
      precio: Number,
      stock: Number
    }
  ]

// Creacion de productos
// POST /productos
request:
  payload: {
    nombre: String,
    descripcion: String,
    precio: Number,
    stock: Number
  }

// Añadir a favoritos
// POST /usuarios/{id}/favoritos
request:
  payload: {
    productoId: Number
  }

response:
  {
    message: "Producto agregado a favoritos"
  }

// Obtener listado de favoritos
// GET /usuarios/{id}/favoritos
response:
  [
    {
      productoId: Number,
      nombre: String,
      precio: Number
    }
  ]

// Agregar productos al carro de compras
// POST /usuarios/{id}/carrito
request:
  payload: {
    productoId: Number,
    cantidad: Number
  }

response:
  {
    message: "Producto agregado al carrito"
  }

// Obtener los articulos del carro por usuario
// GET /usuarios/{id}/carrito
response:
  [
    {
      productoId: Number,
      nombre: String,
      cantidad: Number,
      precio: Number
    }
  ]

// Crear la orden de venta
// POST /ventas
request:
  payload: {
    usuarioId: Number,
    items: [
      {
        productoId: Number,
        cantidad: Number
      }
    ]
  }

response:
  {
    ventaId: Number,
    fecha: String,
    total: Number
  }

// Obtener registro de la orden de venta
// GET /usuarios/{id}/ventas
response:
  [
    {
      ventaId: Number,
      fecha: String,
      total: Number,
      items: [
        {
          productoId: Number,
          nombre: String,
          cantidad: Number,
          precioUnitario: Number
        }
      ]
    }
  ]
