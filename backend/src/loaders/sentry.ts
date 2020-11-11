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
}
