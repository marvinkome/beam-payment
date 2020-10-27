import express from "express"

import expressLoader from "./express"
import dbLoader from "./mongoose"
import Logger from "./logger"
import firebaseLoader from "./firebase"
import apolloLoader from "./apollo"

export default function ({ app }: { app: express.Application }) {
    // initialize DB
    dbLoader()

    // initialize firebase
    firebaseLoader()

    // initialize App
    expressLoader({ app })

    // initialize apollo
    apolloLoader({ app })

    Logger.info("🚀 Loaders Initialized")
}
