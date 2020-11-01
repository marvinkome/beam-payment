import { gql } from "apollo-server-express"
import { IUser } from "models/users"

export const userTypeDef = gql`
    enum AccountSetupState {
        SET_PIN
        ADD_MONEY
        COMPLETE
    }

    type User {
        id: ID
        isNewAccount: Boolean
        accountSetupState: AccountSetupState
        accountBalance: Float
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
