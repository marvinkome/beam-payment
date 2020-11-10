import { handleUSSDCode } from "controllers/ussd"
import { Router } from "express"
const router = Router()

router.post("/", handleUSSDCode)

export default router
