import { gql } from "apollo-server-express"
import { authenticateUser } from "controllers/authentication"

export const mutationTypeDef = gql`
    # Inputs

    # Response
    type AuthenticationMutationResponse {
        success: Boolean!
        responseMessage: String
        token: String
        isNewAccount: Boolean
        user: User
    }

    type Mutation {
        # AUTH
        authenticateUser(idToken: String!): AuthenticationMutationResponse
    }
`

export const mutationResolver = {
    Mutation: {
        authenticateUser: async (_: any, data: { idToken: string }) => {
            return await authenticateUser(data)
        },
    },
}
