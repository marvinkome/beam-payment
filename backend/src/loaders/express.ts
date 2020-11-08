import express from "express"
import bodyParser from "body-parser"
import { router } from "api/routes"

export default function ({ app }: { app: express.Application }) {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.get("/liveness", (req, res) => {
        res.status(200).end()
    })

    app.use(router)

    return app
}
