import * as Sentry from "@sentry/node"
import User from "models/users"
import { auth } from "firebase-admin"
import { findAndVerifyAccount, findOrCreateUserAccount } from "services/authentication"
import { UserService } from "services/user"

export async function authenticateUser(data: { idToken: string; referedBy?: string }) {
    try {
        const { phone_number, uid } = await auth().verifyIdToken(data.idToken)

        // create user and return jwt token
        const { user, token, isCreated } = await findOrCreateUserAccount(phone_number!, uid)

        if (data.referedBy && isCreated) {
            // add money to refered user
            const user = await User.findOne({ phoneNumber: data.referedBy })
            if (user) {
                const userService = new UserService(user)
                await userService.addReferralMoney()
            }
        }

        return {
            success: true,
            user,
            token,
        }
    } catch (e) {
        Sentry.captureException(e)
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
        Sentry.captureException(e)
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
        Sentry.captureException(e)
        return false
    }
}
