import Transaction from "models/transactions"
import { IUser } from "models/users"

type TransactionDataType = {
    transaction_id: string
    amountRecieved: number
    amountPaid: number
    from?: IUser
    fromFlutterWave?: boolean
    to?: IUser
    toBank?: string
}
export function storeTransaction(data: TransactionDataType) {
    const tx = new Transaction()

    tx.flutterwave_txId = data.transaction_id
    tx.amount = data.amountRecieved
    tx.fees = parseFloat((data.amountRecieved - data.amountPaid).toFixed(2))

    if (data.fromFlutterWave) {
        tx.fromFlutterWave = data.fromFlutterWave
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
