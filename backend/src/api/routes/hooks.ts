import config from "config"
import Logger from "loaders/logger"
import Transaction from "models/transactions"

import { Router } from "express"
import { UserService } from "services/user"
import { IUser } from "models/users"
const router = Router()

router.post("/transfer", async (req, res) => {
    // Logs
    Logger.info("Transfer webhook received")

    const hash = req.headers["verif-hash"]
    if (!hash) {
        return res.sendStatus(200)
    }

    const secret_hash = config.flutterwaveSecretHash
    if (hash !== secret_hash) {
        return res.sendStatus(200)
    }

    // if transfer wasn't successful, return the original amount
    const response = req.body
    if (
        response?.data?.status === "SUCCESSFUL" &&
        response?.data?.complete_message === "Successful"
    ) {
        return res.sendStatus(200)
    }

    const transactionRef = await Transaction.findOne({
        transactionId: response.data?.reference,
    })
    if (!transactionRef) {
        return res.sendStatus(200)
    }

    // refund user
    const userService = new UserService(transactionRef.populate("to").to! as IUser)
    await userService.revertTransaction(transactionRef)

    res.sendStatus(200)
})

export default router
