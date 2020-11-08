import { Router } from "express"
import hookRoute from "./hooks"
export const router = Router()

router.use("/hooks", hookRoute)
