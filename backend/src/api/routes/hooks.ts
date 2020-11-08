import { Router } from "express"
import config from "config"
import Logger from "loaders/logger"
const router = Router()

router.post("/transfer", async (req, res) => {
    // Logs
    Logger.info("Transfer webhook received")

    const hash = req.headers["verify-hash"]
    if (!hash) {
        return res.send(200)
    }

    const secret_hash = config.flutterwaveSecretHash
    if (hash !== secret_hash) {
        return res.send(200)
    }

    const reqJson = JSON.parse(req.body)
    console.log(reqJson)

    res.send(200)
})

export default router
