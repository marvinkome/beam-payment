import { scheduleJob } from "node-schedule"
import { EventEmitter } from "events"
import { ITransaction } from "models/transactions"
import { IUser } from "models/users"
import { NotificationService } from "services/notification"
import { UserService } from "services/user"

export const transferEvent = new EventEmitter()

interface TransferEventObject {
    sender: IUser
    receiver: IUser
    amount: number
    transaction: ITransaction
}

transferEvent.on("transfer", async (data: TransferEventObject) => {
    // sent credit alert to receiver
    await NotificationService.sendCreditAlert(data.receiver, data.amount, data.sender)

    // set job to refund money if receiver doesn't claim it
    if (!data.receiver.pin) {
        const today = new Date()
        const triggerDate = new Date(today)
        triggerDate.setHours(today.getHours() + 24) // triggers in 24hours

        // return money back to account and delete user in 24hrs
        scheduleJob(
            triggerDate,
            function () {
                if (!data.receiver.pin) {
                    const senderService = new UserService(data.sender)

                    senderService.undoTransaction(data.transaction).then(() => {
                        data.receiver.deleteOne()
                    })
                }
            }.bind(this, data)
        )
    }
})
