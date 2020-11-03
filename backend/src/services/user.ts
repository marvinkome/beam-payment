import config from "config"
import Logger from "loaders/logger"
import { IUser } from "models/users"
import { nanoid } from "nanoid"
import { storeTransaction } from "./transactions"

const Flutterwave = require("flutterwave-node-v3")
const flw = new Flutterwave(config.flutterwavePublicKey, config.flutterwaveSecretKey)

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
        const flwResp = await flw.Transaction.verify({ id: data.tx_id })

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
}
