import { gql } from "apollo-server-express"
import { authenticateUser, loginUser, forgetPin } from "controllers/authentication"
import * as userController from "controllers/users"
import { authenticated } from "libs/auth"
import { IContext } from "loaders/apollo"

export const mutationTypeDef = gql`
    # Inputs
    input AddMoneyInput {
        tx_ref: String!
        tx_id: String!
        amount: Float!
    }

    input AccountDetailsInput {
        accNumber: String!
        bankName: String!
        bankCode: String!
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
        loginUser(phoneNumber: String!, pin: String!): AuthenticationMutationResponse
        forgetPin(phoneNumber: String!): Boolean

        # USERS
        setPin(pin: String!): UserMutationResponse
        setNotificationToken(token: String!): UserMutationResponse
        addMoney(data: AddMoneyInput): UserMutationResponse
        transferMoney(amount: Float!, receiverNumber: String!): UserMutationResponse
        saveBankDetails(data: AccountDetailsInput): UserMutationResponse
        withdrawMoney: UserMutationResponse
    }
`

export const mutationResolver = {
    Mutation: {
        /* AUTHENTICATION */
        authenticateUser: async (_: any, data: { idToken: string }) => {
            return authenticateUser(data)
        },

        loginUser: async (_: any, data: { phoneNumber: string; pin: string }) => {
            return loginUser(data)
        },

        forgetPin: async (_: any, data: { phoneNumber: string }) => {
            return forgetPin(data)
        },

        /* USERS */
        setPin: authenticated(async (_: any, data: { pin: string }, ctx: IContext) => {
            return userController.setPin(data, ctx.currentUser)
        }),

        setNotificationToken: authenticated(
            async (_: any, data: { token: string }, ctx: IContext) => {
                return userController.setNotificationToken(data, ctx.currentUser)
            }
        ),

        addMoney: authenticated(async (_: any, { data }: any, ctx: IContext) => {
            return userController.addMoney(data, ctx.currentUser)
        }),

        transferMoney: authenticated(async (_: any, data: any, ctx: IContext) => {
            return userController.transferMoney(data, ctx.currentUser)
        }),

        saveBankDetails: authenticated(async (_: any, { data }: any, ctx: IContext) => {
            return userController.storeAccountDetails(data, ctx.currentUser)
        }),

        withdrawMoney: authenticated(async (_: any, __: any, ctx: IContext) => {
            return userController.withdrawMoney(ctx.currentUser)
        }),
    },
}
