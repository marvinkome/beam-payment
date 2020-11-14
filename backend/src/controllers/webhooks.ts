import * as Sentry from "@sentry/node"
import config from "config"
import express from "express"
import Logger from "loaders/logger"
import Transaction from "models/transactions"
import { IUser } from "models/users"
import { UserService } from "services/user"

export async function onFailedWithdrawal(req: express.Request, res: express.Response) {
    // Logs
    // Logger.info("Transfer webhook received", req.body)

    const hash = req.headers["verif-hash"]
    if (!hash) return res.sendStatus(200)

    const secret_hash = config.flutterwaveSecretHash
    if (hash !== secret_hash) res.sendStatus(200)

    // if transfer wasn't successful, return the original amount
    const response = req.body
    Sentry.addBreadcrumb(response)

    if (
        response?.data?.status === "SUCCESSFUL" &&
        response?.data?.complete_message === "Successful"
    ) {
        return res.sendStatus(200)
    }

    const transactionRef = await Transaction.findOne({ transactionId: response.data?.reference })

    if (!transactionRef) {
        return res.sendStatus(200)
    }

    // refund user
    const { from } = await transactionRef.populate("from").execPopulate()
    const userService = new UserService(from! as IUser)
    await userService.revertTransaction(transactionRef)

    res.sendStatus(200)
}
