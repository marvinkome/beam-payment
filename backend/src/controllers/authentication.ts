import { auth } from "firebase-admin"
import { findOrCreateUserAccount } from "services/authentication"

export async function authenticateUser(data: { idToken: string }) {
    try {
        const { phone_number, uid } = await auth().verifyIdToken(data.idToken)

        // create user and return jwt token
        const { user, token, isNewAccount } = await findOrCreateUserAccount(phone_number!, uid)

        return {
            success: true,
            user,
            token,
            isNewAccount,
        }
    } catch (e) {
        return {
            success: false,
            responseMessage: "Error creating account",
        }
    }
}
