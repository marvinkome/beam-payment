import { gql } from "apollo-server-express"
import { IContext } from "loaders/apollo"
import { ITransaction } from "models/transactions"

export const transactionTypeDef = gql`
    enum TransactionType {
        CREDIT
        DEBIT
    }

    type Transaction {
        id: ID
        transactionId: String
        transactionType: TransactionType
        between: User
        amount: Float
        createdAt: String
    }
`

export const transactionResolver = {
    Transaction: {
        transactionType: (transaction: ITransaction, _: any, ctx: IContext) => {
            if (ctx.currentUser?.id === `${transaction.to}`) {
                return "CREDIT"
            }

            if (ctx.currentUser?.id === `${transaction.from}`) {
                return "DEBIT"
            }
        },

        between: async (transaction: ITransaction, _: any, ctx: IContext) => {
            if (ctx.currentUser?.id === `${transaction.to}`) {
                const t = await transaction.populate("from").execPopulate()
                return t.from
            }

            if (ctx.currentUser?.id === `${transaction.from}`) {
                const t = await transaction.populate("to").execPopulate()
                return t.to
            }

            return null
        },

        amount: (transaction: ITransaction) => {
            return transaction.amount - transaction.fees
        },
    },
}
