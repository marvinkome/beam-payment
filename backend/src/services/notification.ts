import config from "config"
import Logger from "loaders/logger"
import { messaging } from "firebase-admin"
import { AfricasTalking } from "loaders/africastalking"
import { IUser } from "models/users"

type BaseNotificationOptions = {
    title: string
    userToken: string
    body?: string
}
type BaseSMSOptions = {
    to: string
    message: string
}

export class NotificationService {
    static async sendCreditAlert(receiver: IUser, amount: number, sender: IUser) {
        const message = `You just received NGN${amount} from ${sender.phoneNumber}. New balance is NGN${receiver.accountBalance}`

        if (!receiver.notificationToken) {
            return this.sendSMS({ to: receiver.phoneNumber, message })
        }

        return this.sendFirebaseNotification({
            userToken: receiver.notificationToken,
            title: "Transaction Notification",
            body: message,
        })
    }

    // sender points to person who sent the transaction
    static async sendDebitAlert(sender: IUser, amount: number, receiver: IUser) {
        const message = `You just sent NGN${amount} to ${receiver.phoneNumber}. New balance is NGN${sender.accountBalance}`

        if (!sender.notificationToken) {
            return this.sendSMS({ to: sender.phoneNumber, message })
        }

        return this.sendFirebaseNotification({
            userToken: sender.notificationToken,
            title: "Transaction Notification",
            body: message,
        })
    }

    private static sendFirebaseNotification(data: BaseNotificationOptions) {
        return messaging().send({
            token: data.userToken,
            notification: {
                title: data.title,
                body: data.body,
            },
        })
    }

    private static async sendSMS(data: BaseSMSOptions) {
        try {
            const response = await AfricasTalking.SMS().send({
                to: [data.to],
                message: data.message,
                from: config.africasTalkingSender,
            })

            if (response.SMSMessageData.Recipients[0].status !== "Success") {
                Logger.error("🔥 error: %o", response.SMSMessageData)
            }
        } catch (err) {
            Logger.error("🔥 error: %o", err)
        }
    }
}
