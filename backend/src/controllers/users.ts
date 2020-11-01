import config from "config"
import { IUser } from "models/users"
import { storeTransaction } from "services/transactions"
import { addMoneyToAccount, setUserPin } from "services/user"

const Flutterwave = require("flutterwave-node-v3")
const flw = new Flutterwave(config.flutterwavePublicKey, config.flutterwaveSecretKey)

export async function setPin(data: { pin: string }, user: IUser | null) {
    // set pin and return user
    if (!user) return

    try {
        const newUser = await setUserPin(data.pin, user)
        return {
            success: true,
            user: newUser,
        }
    } catch (e) {
        // todo:: add sentry
        return {
            success: false,
            responseMessage: "Error saving pin. Please try again",
        }
    }
}

export async function addMoney(
    data: { tx_id: string; tx_ref: string; amount: number },
    user: IUser | null
) {
    if (!user) return

    // verify transaction
    const flwResp = await flw.Transaction.verify({
        id: data.tx_id,
    })

    const isInvalid =
        flwResp.status !== "success" &&
        flwResp.data?.status !== "successful" &&
        flwResp.data?.tx_ref !== data.tx_ref &&
        flwResp.data?.currency !== "NGN"

    if (isInvalid) {
        console.log("error", flwResp)
        return {
            success: false,
            responseMessage: flwResp.message,
        }
    }

    try {
        // add money to user account
        const newUser = await addMoneyToAccount(data.amount, user)

        // create new credit transaction
        await storeTransaction({
            transaction_id: `${flwResp.data?.id}`,
            amountPaid: data.amount,
            amountRecieved: flwResp.data?.amount_settled,
            transactionType: "credit",
            fromFlutterWave: true,
            to: newUser,
        })

        return {
            success: true,
            user: newUser,
        }
    } catch (err) {
        // todo:: add sentry
        console.log(err)
        return {
            success: false,
            responseMessage: "Something went wrong while adding money to your account",
        }
    }
}
