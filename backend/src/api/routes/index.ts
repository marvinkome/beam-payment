import { Router } from "express"
import Logger from "loaders/logger"
import hookRoute from "./hooks"
import ussdRoute from "./ussd"

export const router = Router()

router.use((req, res, next) => {
    Logger.info(`${req.method} - ${req.url}`)
    Logger.info(`${res.statusCode}`)
    next()
})

router.use("/hooks", hookRoute)
router.use("/ussd", ussdRoute)
