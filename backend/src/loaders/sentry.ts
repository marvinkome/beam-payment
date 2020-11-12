import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"
import express from "express"
import config from "config"

export default function sentryLoader({ app }: { app: express.Application }) {
    Sentry.init({
        dsn: config.sentryId,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Tracing.Integrations.Express({ app }),
        ],
    })

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
}
