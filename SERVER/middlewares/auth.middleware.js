import jwt from "jsonwebtoken"

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ msg: "Sin token" })

  const token = authHeader.split(" ")[1]

  try {
    const secreto = process.env.JWT_SECRET || "secreto_super_secreto"
    const decoded = jwt.verify(token, secreto)
    req.usuario = decoded
    next()
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" })
  }
}
export default { verificarToken }