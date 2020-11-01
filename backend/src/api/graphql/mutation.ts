import { gql } from "apollo-server-express"
import { authenticateUser } from "controllers/authentication"
import { addMoney, setPin } from "controllers/users"
import { authenticated, generateToken } from "libs/auth"
import { IContext } from "loaders/apollo"
import User from "models/users"

export const mutationTypeDef = gql`
    # Inputs
    input AddMoneyInput {
        tx_ref: String!
        tx_id: String!
        amount: Float!
    }

    # Response
    type AuthenticationMutationResponse {
        success: Boolean!
        responseMessage: String
        token: String
        user: User
    }

    type UserMutationResponse {
        success: Boolean!
        responseMessage: String
        user: User
    }

    type Mutation {
        # AUTH
        authenticateUser(idToken: String!): AuthenticationMutationResponse

        # REMOVE!!!!!!
        fakeToken(userPhone: String!): AuthenticationMutationResponse

        # USERS
        setPin(pin: String!): UserMutationResponse
        addMoney(data: AddMoneyInput): UserMutationResponse
    }
`

export const mutationResolver = {
    Mutation: {
        /* AUTHENTICATION */
        authenticateUser: async (_: any, data: { idToken: string }) => {
            return authenticateUser(data)
        },

        // REMOVE!!!!!!
        fakeToken: async (_: any, data: { userPhone: string }) => {
            const user = await User.findOne({ phoneNumber: data.userPhone })

            return {
                success: true,
                user,
                token: generateToken(user!),
            }
        },

        /* USERS */
        setPin: authenticated(async (_: any, data: { pin: string }, ctx: IContext) => {
            return setPin(data, ctx.currentUser)
        }),

        addMoney: authenticated(async (_: any, { data }: any, ctx: IContext) => {
            return addMoney(data, ctx.currentUser)
        }),
    },
}
