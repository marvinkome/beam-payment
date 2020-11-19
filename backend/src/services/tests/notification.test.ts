import User from "models/users"
import { messaging } from "firebase-admin"
import { AfricasTalking } from "loaders/africastalking"
import { NotificationService } from "services/notification"

describe("Notification tests", () => {
    test("credit alert - with sms", async () => {
        const receiver = new User({ phoneNumber: "+2349087573383", accountBalance: 150 })
        const sender = new User({ phoneNumber: "+2349087573397" })

        await NotificationService.sendCreditAlert(receiver, 100, sender)

        expect(messaging().send).not.toBeCalled()
        expect(AfricasTalking.SMS.send).toBeCalledWith({
            to: ["+2349087573383"],
            message: `NGN100 was sent to you from +2349087573397. New balance: NGN150.
 Collect with https://usebeam.app`,
        })
    })

    test("credit alert - with token", async () => {
        const receiver = new User({
            phoneNumber: "+2349087573383",
            accountBalance: 150,
            notificationToken: "notif-token",
        })
        const sender = new User({ phoneNumber: "+2349087573397" })

        await NotificationService.sendCreditAlert(receiver, 100, sender)

        expect(messaging().send).toBeCalledWith({
            token: "notif-token",
            notification: {
                title: "Transaction Notification",
                body: "NGN100 was sent to you from +2349087573397. New balance: NGN150.",
            },
        })
        expect(AfricasTalking.SMS.send).not.toBeCalled()
    })

    test("debit alert - with sms", async () => {
        const receiver = new User({ phoneNumber: "+2349087573383" })
        const sender = new User({ phoneNumber: "+2349087573397", accountBalance: 45 })

        await NotificationService.sendDebitAlert(sender, 100, receiver)

        expect(messaging().send).not.toBeCalled()
        expect(AfricasTalking.SMS.send).toBeCalledWith({
            to: ["+2349087573397"],
            message: "You just sent NGN100 to +2349087573383. Your new balance is NGN45",
        })
    })

    test("debit alert - with token", async () => {
        const receiver = new User({ phoneNumber: "+2349087573383" })
        const sender = new User({
            phoneNumber: "+2349087573397",
            accountBalance: 45,
            notificationToken: "notif-token",
        })

        await NotificationService.sendDebitAlert(sender, 100, receiver)

        expect(messaging().send).toBeCalledWith({
            token: "notif-token",
            notification: {
                title: "Transaction Notification",
                body: "You just sent NGN100 to +2349087573383. Your new balance is NGN45",
            },
        })
        expect(AfricasTalking.SMS.send).not.toBeCalled()
    })
})
