import { gql } from "apollo-server-express"
import { authenticateUser } from "controllers/authentication"
import { setPin } from "controllers/users"
import { authenticated } from "libs/auth"
import { IContext } from "loaders/apollo"

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

    type SetPinMutationResponse {
        success: Boolean!
        responseMessage: String
        user: User
    }

    type Mutation {
        # AUTH
        authenticateUser(idToken: String!): AuthenticationMutationResponse

        # USERS
        setPin(pin: String!): SetPinMutationResponse
    }
`

export const mutationResolver = {
    Mutation: {
        /* AUTHENTICATION */
        authenticateUser: async (_: any, data: { idToken: string }) => {
            return authenticateUser(data)
        },

        /* USERS */
        setPin: authenticated(async (_: any, data: { pin: string }, ctx: IContext) => {
            return setPin(data, ctx.currentUser)
        }),
    },
}
