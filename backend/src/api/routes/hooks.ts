import { Router } from "express"
import { onFailedWithdrawal } from "controllers/webhooks"
const router = Router()

router.post("/transfer", onFailedWithdrawal)

export default router
