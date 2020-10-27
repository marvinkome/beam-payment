import express from "express"
import {
    ApolloServer,
    makeExecutableSchema,
    ApolloServerExpressConfig,
} from "apollo-server-express"
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

    const apolloServer = new ApolloServer({ typeDefs, resolvers, context })
    apolloServer.applyMiddleware({ app })

    return apolloServer
}
