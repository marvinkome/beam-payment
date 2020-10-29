import { auth } from "firebase-admin"
import Logger from "loaders/logger"
import { findOrCreateUserAccount } from "services/authentication"

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
