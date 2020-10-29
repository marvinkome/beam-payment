import express from "express"
import Logger from "./logger"
import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express"
import { IUser } from "models/users"
import { getTokenFromHeaders, getUserFromToken } from "libs/auth"
import { typeDefs, resolvers } from "api/graphql"

export interface IContext {
    currentUser: IUser | null
}

export default function apolloLoader({ app }: { app: express.Application }) {
    const context: ApolloServerExpressConfig["context"] = async (ctx): Promise<IContext> => {
        const authToken = getTokenFromHeaders(ctx.req)
        const currentUser = await getUserFromToken(authToken || "")

        return { currentUser }
    }

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context,
        plugins: [
            {
                requestDidStart(ctx) {
                    const timer = Date.now()
                    Logger.info(`→ Request started`)
                    Logger.info(`Query ${ctx.request.operationName}`)
                    Logger.info(`Variable ${JSON.stringify(ctx.request.variables)}`)

                    return {
                        didEncounterErrors(ctx) {
                            Logger.error(
                                "An error happened in response to query " +
                                    ctx.request.operationName
                            )
                            Logger.error(ctx.errors)
                        },

                        willSendResponse(ctx) {
                            Logger.info(`→ Response sent in ${Date.now() - timer}ms`)
                        },
                    }
                },
            },
        ],
    })

    apolloServer.applyMiddleware({ app })

    return apolloServer
}
