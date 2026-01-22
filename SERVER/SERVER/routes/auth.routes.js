import express from "express"
import { register, login, updateUser } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.put("/usuarios/:id", updateUser)

export default router
