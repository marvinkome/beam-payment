import Transaction, { TransactionFeeType } from "models/transactions"
import { IUser } from "models/users"

type TransactionDataType = {
    transaction_id: string
    amountRecieved: number
    amountPaid: number
    feeType?: TransactionFeeType
    from?: IUser
    fromFlutterWave?: boolean
    reversed?: boolean
    to?: IUser
    toBank?: string
}
export function storeTransaction(data: TransactionDataType) {
    const tx = new Transaction()

    tx.transactionId = data.transaction_id
    tx.amount = data.amountRecieved
    tx.fees = parseFloat((data.amountRecieved - data.amountPaid).toFixed(2))
    tx.feeType = data.feeType

    if (data.fromFlutterWave) {
        tx.fromFlutterWave = data.fromFlutterWave
    } else if (data.reversed) {
        tx.reversed = data.reversed
    } else {
        tx.from = data.from
    }

    if (data.toBank) {
        tx.toBank = data.toBank
    } else {
        tx.to = data.to
    }

    return tx.save()
}

export function deleteTransaction(transactionId: string) {
    return Transaction.deleteOne({ transactionId })
}
