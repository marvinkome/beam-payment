import { gql } from "apollo-server-express"

export const queryTypeDef = gql`
    type Query {
        hello: String
    }
`

export const queryResolver = {
    Query: {
        hello: () => "world",
    },
}
