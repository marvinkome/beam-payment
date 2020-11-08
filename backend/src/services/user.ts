import config from "config"
import Logger from "loaders/logger"
import Flutterwave from "loaders/flutterwave"
import { IUser } from "models/users"
import { nanoid } from "nanoid"
import { storeTransaction } from "./transactions"
import { ITransaction } from "models/transactions"

export class UserService {
    user: IUser

    constructor(user: IUser) {
        this.user = user
    }

    setPin(pin: string) {
        this.user.pin = pin
        return this.user.save()
    }

    async addMoney(data: { tx_id: string; tx_ref: string; amount: number }) {
        // verify transaction
        const flwResp = await Flutterwave.Transaction.verify({ id: data.tx_id })

        const isInvalid =
            flwResp.status !== "success" ||
            flwResp.data?.status !== "successful" ||
            flwResp.data?.tx_ref !== data.tx_ref ||
            flwResp.data?.currency !== "NGN"

        if (isInvalid) {
            Logger.error("🔥 error: %o", flwResp)
            throw new Error(flwResp.message)
        }

        // credit user
        this.user.accountBalance = (this.user.accountBalance || 0) + data.amount
        await this.user.save()

        // store transaction
        await storeTransaction({
            transaction_id: `${flwResp.data?.id}`,
            amountPaid: data.amount,
            amountRecieved: flwResp.data?.amount_settled,
            fromFlutterWave: true,
            to: this.user,
        })

        return this.user
    }

    async transferMoneyToAccount(amount: number, receiver: IUser) {
        // calculate fees if using SMS
        let amountRecieved = amount
        // let sendSMS = false
        if (!receiver.notificationToken) {
            amountRecieved = amount + config.transactionFees.smsFee
            // sendSMS = true
        }

        // remove money from user account
        const currentBalance = this.user.accountBalance
        const newAccountBalance = (currentBalance || 0) - amountRecieved

        if (newAccountBalance < 0) {
            throw new Error("Insufficient funds")
        }

        this.user.accountBalance = newAccountBalance

        // add money to receiver
        receiver.accountBalance = (receiver.accountBalance || 0) + amount
        await receiver.save()

        await storeTransaction({
            transaction_id: nanoid(),
            amountPaid: amount,
            amountRecieved,
            from: this.user,
            to: receiver,
        })

        return this.user
    }

    async storeAccountDetails(details: { accNumber: string; bankName: string; bankCode: string }) {
        this.user.bankDetails = {
            accountNumber: details.accNumber,
            bankName: details.bankName,
            bankCode: details.bankCode,
        }

        return this.user.save()
    }

    async withdrawMoney() {
        const userBalance = this.user.accountBalance || 0

        // calculate money to send
        const amountToSend = userBalance - userBalance * config.transactionFees.withdrawFee

        // intialize transfer through flutterwave
        const reference = nanoid()
        let response = null

        try {
            response = await Flutterwave.Transfer.initiate({
                account_bank: this.user.bankDetails?.bankCode,
                account_number: this.user.bankDetails?.accountNumber,
                amount: amountToSend,
                currency: "NGN",
                reference,
                debit_currency: "NGN",
                callback_url: `${config.serverUrl}/hooks/transfer`,
            })

            await storeTransaction({
                transaction_id: reference,
                amountPaid: amountToSend,
                amountRecieved: userBalance,
                toBank: `${this.user.bankDetails?.bankName} - ${this.user.bankDetails?.accountNumber}`,
                from: this.user,
            })
        } catch (err) {
            Logger.error("🔥 error: %o", response)
            throw new Error(err.message)
        }

        // debit user
        this.user.accountBalance = 0
        return this.user.save()
    }

    async revertTransaction(transaction: ITransaction) {
        const amountToCredit = transaction.amount + transaction.fees
        this.user.accountBalance = amountToCredit

        await storeTransaction({
            transaction_id: nanoid(),
            amountPaid: amountToCredit,
            amountRecieved: amountToCredit,
            to: this.user,
            reversed: true,
        })

        return this.user.save()
    }
}
