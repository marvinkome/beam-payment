import { Schema, Document, model } from "mongoose"
import { IUser } from "./users"

export enum TransactionFeeType {
    SMS = "SMS",
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    REVERSAL = "REVERSAL",
    REFERRAL = "REFERRAL",
}

export interface ITransaction extends Document {
    transactionId: string
    from?: string | Schema.Types.ObjectId | IUser // user
    fromFlutterWave?: boolean
    reversed?: boolean
    to?: string | Schema.Types.ObjectId | IUser // user
    toBank?: string
    amount: number
    fees: number
    feeType?: TransactionFeeType
}

const transactionSchema: Schema<ITransaction> = new Schema(
    {
        transactionId: {
            type: String,
            required: true,
        },

        amount: {
            min: 0,
            type: Number,
            required: true,
        },

        fees: {
            min: 0,
            type: Number,
            required: true,
        },

        feeType: {
            type: String,
        },

        // either from user or flutterwave
        fromFlutterWave: Boolean,
        reversed: Boolean,
        from: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        // either to user or bank
        toBank: String,
        to: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
)

const Transaction = model<ITransaction>("Transaction", transactionSchema)
export default Transaction
