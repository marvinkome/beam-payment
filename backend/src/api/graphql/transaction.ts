import { gql } from "apollo-server-express"
import { capitalize } from "libs/helpers"
import { IContext } from "loaders/apollo"
import { ITransaction } from "models/transactions"
import { IUser } from "models/users"

export const transactionTypeDef = gql`
    enum TransactionType {
        CREDIT
        DEBIT
    }

    enum TransactionFeeType {
        SMS
        DEPOSIT
        WITHDRAWAL
        REVERSAL
        REFERRAL
    }

    type TransactionFee {
        amount: Float
        type: TransactionFeeType
    }

    type Transaction {
        id: ID
        transactionId: String
        transactionType: TransactionType
        between: User
        details: String
        amount: Float
        fee: TransactionFee
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

        details: async (transaction: ITransaction, _: any, ctx: IContext) => {
            if (ctx.currentUser?.id === `${transaction.to}`) {
                const t = await transaction.populate("from").execPopulate()
                return (
                    (t.from as IUser)?.phoneNumber ||
                    capitalize(transaction?.feeType || "") ||
                    "Deposit"
                )
            }

            if (ctx.currentUser?.id === `${transaction.from}`) {
                const t = await transaction.populate("to").execPopulate()
                return (
                    (t.to as IUser)?.phoneNumber ||
                    capitalize(transaction?.feeType || "") ||
                    "Withdraw"
                )
            }

            return null
        },

        amount: (transaction: ITransaction) => {
            return transaction.amount - transaction.fees
        },

        fee: async (transaction: ITransaction) => {
            return {
                amount: transaction.fees,
                type: transaction.feeType,
            }
        },
    },
}
