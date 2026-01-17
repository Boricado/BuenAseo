import { verificarToken } from "../middlewares/auth.middleware.js"

router.get("/perfil", verificarToken, getPerfil)
