import * as Sentry from "@sentry/node"
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
        let message = `NGN${amount} was sent to you from ${sender.phoneNumber}. New balance: NGN${receiver.accountBalance}.`

        if (!receiver.notificationToken) {
            message = message + `\n Collect with https://usebeam.app`
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
        const message = `You just sent NGN${amount} to ${receiver.phoneNumber}. Your new balance is NGN${sender.accountBalance}`

        if (!sender.notificationToken) {
            return this.sendSMS({ to: sender.phoneNumber, message })
        }

        return this.sendFirebaseNotification({
            userToken: sender.notificationToken,
            title: "Transaction Notification",
            body: message,
        })
    }

    static async sendReferralNotification(to: IUser) {
        const message = `Someone signed up with your invite link, here's NGN${config.referralFee} 🥳`

        if (!to.notificationToken) return

        return this.sendFirebaseNotification({
            userToken: to.notificationToken,
            title: `Someone signed up with your invite link +NGN${config.referralFee}`,
            body: message,
        })
    }

    private static async sendFirebaseNotification(data: BaseNotificationOptions) {
        try {
            await messaging().send({
                token: data.userToken,
                notification: {
                    title: data.title,
                    body: data.body,
                },
            })
        } catch (err) {
            Sentry.captureException(err)
            Logger.error("🔥 error: %o", err)
        }
    }

    private static async sendSMS(data: BaseSMSOptions) {
        Logger.info("%o", data)

        try {
            const response = await AfricasTalking.SMS.send({
                to: [data.to],
                message: data.message,
                ...(config.africasTalkingSender ? { from: config.africasTalkingSender } : {}),
            })

            Logger.info("%o", response)

            if (response.SMSMessageData?.Recipients[0]?.status !== "Success") {
                Logger.error("🔥 error: %o", response.SMSMessageData)
            }
        } catch (err) {
            Logger.error("🔥 error: %o", err)
        }
    }
}
