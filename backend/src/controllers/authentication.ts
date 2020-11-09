import Logger from "loaders/logger"
import { auth } from "firebase-admin"
import { findAndVerifyAccount, findOrCreateUserAccount } from "services/authentication"
import { UserService } from "services/user"

export async function authenticateUser(data: { idToken: string }) {
    try {
        const { phone_number, uid } = await auth().verifyIdToken(data.idToken)

        // create user and return jwt token
        const { user, token } = await findOrCreateUserAccount(phone_number!, uid)

        return {
            success: true,
            user,
            token,
        }
    } catch (e) {
        // TODO:: use sentry
        Logger.error(e)
        return {
            success: false,
            responseMessage: "Error creating account",
        }
    }
}

export async function loginUser(data: { phoneNumber: string; pin: string }) {
    try {
        // find user and return jwt
        const { user, token, error } = await findAndVerifyAccount(data.phoneNumber, data.pin)
        if (error) {
            throw new Error(error)
        }

        return {
            success: true,
            user,
            token,
        }
    } catch (e) {
        // TODO:: use sentry
        Logger.error(e)
        return {
            success: false,
            responseMessage: "Invalid pin. Please try again",
        }
    }
}

export async function forgetPin(data: { phoneNumber: string }) {
    // set pin and return user
    const { user } = await findOrCreateUserAccount(data.phoneNumber)
    const userService = new UserService(user)

    try {
        await userService.setPin(undefined)
        return true
    } catch (e) {
        // todo:: add sentry
        return false
    }
}
