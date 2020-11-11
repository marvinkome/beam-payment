import { Router } from "express"
import hookRoute from "./hooks"
import ussdRoute from "./ussd"

export const router = Router()

router.use("/hooks", hookRoute)
router.use("/ussd", ussdRoute)
