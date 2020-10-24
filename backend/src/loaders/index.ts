import express from "express"

import expressLoader from "./express"
import dbLoader from "./mongoose"
import Logger from "./logger"

export default function ({ app }: { app: express.Application }) {
    // initialize DB
    dbLoader()
    Logger.info("🚀 DB Initialized")

    // initialize App
    expressLoader({ app })
    Logger.info("🚀 Express Initialized")
}
