import * as Sentry from "@sentry/node"
import Logger from "./logger"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { router } from "api/routes"

export default function ({ app }: { app: express.Application }) {
    app.use(Sentry.Handlers.requestHandler())
    app.use(Sentry.Handlers.tracingHandler())

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.use(cors({ origin: "*" }))

    app.use((req, res, next) => {
        Logger.info(`${req.method} - ${req.url}`)
        Logger.info(`${res.statusCode}`)
        next()
    })

    app.get("/liveness", (req, res) => {
        res.status(200)
        res.send("Beam server is up and running")
    })

    app.use(router)

    app.use(
        Sentry.Handlers.errorHandler({
            shouldHandleError(error) {
                // Capture all 404 and 500 errors
                if (error.status === 404 || error.status === 500) {
                    return true
                }
                return false
            },
        })
    )

    app.use((_: any, res: any) => {
        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        res.statusCode = 500
        res.end(res.sentry + "\n")
    })

    return app
}
