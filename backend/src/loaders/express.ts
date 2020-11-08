import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { router } from "api/routes"

export default function ({ app }: { app: express.Application }) {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.use(cors({ origin: "*" }))

    app.get("/liveness", (req, res) => {
        res.status(200).end()
    })

    app.use(router)

    return app
}
