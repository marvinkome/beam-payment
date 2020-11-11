import { EventEmitter } from "events"
import { IUser } from "models/users"
import { NotificationService } from "services/notification"

export const transferEvent = new EventEmitter()

transferEvent.on("transfer", async (sender: IUser, receiver: IUser, amount: number) => {
    // sent credit alert to receiver
    await NotificationService.sendCreditAlert(receiver, amount, sender)
})
