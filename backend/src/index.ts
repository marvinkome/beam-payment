import express from 'express'
import bodyParser from 'body-parser'

export default function createApp() {
    const app = express()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    return { app }
}
