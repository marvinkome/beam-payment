import { ApolloServer } from "apollo-server-express"
import { typeDefs, resolvers } from "api/graphql"

const defaultContext = () => ({
    currentUser: null as any,
})

export const constructTestServer = ({ context = defaultContext } = {}) => {
    return new ApolloServer({ typeDefs, resolvers, context })
}
