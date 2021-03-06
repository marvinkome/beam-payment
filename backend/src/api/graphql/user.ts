import { gql } from "apollo-server-express"
import { IUser } from "models/users"

export const userTypeDef = gql`
    enum AccountSetupState {
        SET_PIN
        ADD_MONEY
        COMPLETE
    }

    type AccountDetails {
        accountNumber: String
        bankName: String
    }

    type User {
        id: ID
        phoneNumber: String
        notificationToken: String
        isNewAccount: Boolean
        accountSetupState: AccountSetupState
        accountBalance: Float
        bankDetails: AccountDetails
    }
`

export const userResolver = {
    User: {
        isNewAccount: (user: IUser) => {
            if (!user.pin) return true
            if (!user.accountBalance) return true

            return false
        },

        accountSetupState: (user: IUser) => {
            if (!user.pin) return "SET_PIN"
            if (!user.accountBalance) return "ADD_MONEY"

            return "COMPLETE"
        },
    },
}
