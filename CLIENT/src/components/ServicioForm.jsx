import { useEffect, useState } from "react"
import { Form, Button } from "react-bootstrap"
import api from "../services/api"

export default function ServicioForm({ servicioEdit, onFinish }) {
  const [form, setForm] = useState({
    id: "SVC-",
    nombre: "",
    precio: "",
    descripcion: "",
    imagen_url: ""
  })

  useEffect(() => {
    if (servicioEdit) {
      setForm({
        id: servicioEdit.id ?? "",
        nombre: servicioEdit.nombre ?? "",
        precio: servicioEdit.precio ?? "",
        descripcion: servicioEdit.descripcion ?? "",
        imagen_url: servicioEdit.imagen_url ?? ""
      })
    } else {
      setForm({
        id: "SVC-",
        nombre: "",
        precio: "",
        descripcion: "",
        imagen_url: ""
      })
    }
  }, [servicioEdit])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submit = async () => {
    console.log("1. Función submit iniciada para servicio")

    try {
      const idLimpio = form.id.trim()

      // construir payload limpio
      const payload = {
        id: idLimpio,
        nombre: form.nombre.trim(),
        precio: Number(form.precio)
      }

      if (form.descripcion.trim() !== "") payload.descripcion = form.descripcion.trim()
      if (form.imagen_url.trim() !== "") payload.imagen_url = form.imagen_url.trim()

      console.log("2. Datos a enviar:", payload)

      if (servicioEdit) {
        console.log("3. PUT /servicios/" + idLimpio)
        await api.put(`/servicios/${idLimpio}`, payload)
      } else {
        console.log("3. POST /servicios")
        await api.post("/servicios", payload)
      }

      alert("Operación exitosa")
      onFinish()
    } catch (error) {
      console.error("ERROR DETECTADO:", error)
      alert("Error: " + (error.response?.data?.error || error.message))
    }
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>ID</Form.Label>
        <Form.Control
          name="id"
          value={form.id}
          disabled={!!servicioEdit}
          onChange={(e) => {
            const value = e.target.value
            if (!servicioEdit && value.startsWith("SVC-")) {
              setForm({ ...form, id: value })
            }
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Precio</Form.Label>
        <Form.Control
          type="number"
          name="precio"
          value={form.precio}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Imagen URL</Form.Label>
        <Form.Control
          name="imagen_url"
          value={form.imagen_url}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button type="button" variant="primary" onClick={submit}>
          Guardar
        </Button>
      </div>
    </Form>
  )
}
