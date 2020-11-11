import Logger from "loaders/logger"
import * as Sentry from "@sentry/node"
import { transferEvent } from "events/transfer"
import { IUser } from "models/users"
import { findOrCreateUserAccount } from "services/authentication"
import { UserService } from "services/user"

export async function setPin(data: { pin: string }, user: IUser | null) {
    // set pin and return user
    if (!user) return
    const userService = new UserService(user)

    try {
        const updatedUser = await userService.setPin(data.pin)

        return {
            success: true,
            user: updatedUser,
        }
    } catch (e) {
        Sentry.captureException(e)
        return {
            success: false,
            responseMessage: "Error saving pin. Please try again",
        }
    }
}

export async function setNotificationToken(data: { token: string }, user: IUser | null) {
    if (!user) return
    const userService = new UserService(user)

    try {
        const updatedUser = await userService.setNotificationToken(data.token)

        return {
            success: true,
            user: updatedUser,
        }
    } catch (e) {
        Sentry.captureException(e)
        return {
            success: false,
            responseMessage: "Error setting notification token. Please try again",
        }
    }
}

export async function addMoney(
    data: { tx_id: string; tx_ref: string; amount: number },
    user: IUser | null
) {
    if (!user) return
    const userService = new UserService(user)

    try {
        const updatedUser = await userService.addMoney(data)

        return {
            success: true,
            user: updatedUser,
        }
    } catch (err) {
        Sentry.captureException(err)
        Logger.error("🔥 error: %o", err)

        return {
            success: false,
            responseMessage: "Something went wrong while adding money to your account",
        }
    }
}

export async function transferMoney(
    data: { amount: number; receiverNumber: string },
    user: IUser | null
) {
    if (!user) return
    const userService = new UserService(user)

    const { user: receiver } = await findOrCreateUserAccount(data.receiverNumber)

    // transfer money to receiver
    try {
        const updatedUser = await userService.transferMoneyToAccount(data.amount, receiver)

        // handle all after transaction events
        transferEvent.emit("transfer", updatedUser, receiver, data.amount)

        return {
            success: true,
            user: updatedUser,
        }
    } catch (err) {
        Sentry.captureException(err)
        Logger.error("🔥 error: %o", err)

        return {
            success: false,
            responseMessage: err.message,
        }
    }
}

export async function storeAccountDetails(
    data: { accNumber: string; bankName: string; bankCode: string },
    user: IUser | null
) {
    if (!user) return
    const userService = new UserService(user)

    try {
        const updatedUser = await userService.storeAccountDetails(data)
        return {
            success: true,
            user: updatedUser,
        }
    } catch (err) {
        Sentry.captureException(err)
        Logger.error("🔥 error: %o", err)

        return {
            success: false,
            responseMessage: "Something went wrong.",
        }
    }
}

export async function withdrawMoney(user: IUser | null) {
    if (!user) return
    const userService = new UserService(user)

    try {
        const updatedUser = await userService.withdrawMoney()
        return {
            success: true,
            user: updatedUser,
        }
    } catch (err) {
        Sentry.captureException(err)
        Logger.error("🔥 error: %o", err)

        return {
            success: false,
            responseMessage: "Something went wrong.",
        }
    }
}
